"""

From https://www.reddit.com/r/PathOfExile2/comments/1f78jkk/poe_2_skill_tree_programmatically_detecting_nodes/
"""

from dataclasses import dataclass
from typing import Literal, Self, cast
import cv2
import numpy as np
import json

MAX_RADIUS = 20  # max size just in case
MIN_RADIUS = 5  # enforce a minimum radius
MIN_CONTOUR_AREA = 2  # remove individual pixels separated from others


@dataclass
class Circle:
    x: int
    y: int
    radius: int

    @property
    def kind(self) -> Literal["small"] | Literal["notable"] | Literal["keystone"]:
        if 1 <= self.radius <= 7:
            return "small"

        elif 8 <= self.radius <= 10:
            return "notable"

        elif 11 <= self.radius <= 14:
            return "keystone"

        else:
            raise ValueError(f"Radius too large, {self.radius=}")

    @classmethod
    def from_data(cls, x: int, y: int, radius: int) -> Self:
        return cls(x=x, y=y, radius=radius)

    def circles_overlap(self, other: "Circle") -> bool:
        distance: float = np.sqrt((other.x - self.x) ** 2 + (other.y - self.y) ** 2)

        return distance < (self.radius + other.radius)


def main():
    # convert to grayscale and darken darks to hide edges
    image = cv2.imread("data/skill-tree-edited.png")
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    scaled = np.where(gray < 55, 0, gray)

    # find all the contours in the image and filter small areas
    contours, _ = cv2.findContours(scaled, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    filtered_contours = [
        contour for contour in contours if cv2.contourArea(contour) >= MIN_CONTOUR_AREA
    ]

    # list for all circles (overlaps removed later)
    all_circles: list[Circle] = []
    for contour in filtered_contours:
        # get the minimum enclosing circle
        (center_x, center_y), radius = cv2.minEnclosingCircle(contour)
        center_x, center_y = int(center_x), int(center_y)
        radius = int(
            max(min(radius, MAX_RADIUS), MIN_RADIUS)
        )  # enforce min and max radius

        all_circles.append(Circle.from_data(center_x, center_y, radius))

    # remove overlaps, keep only the larger circle in overlapping pairs
    final_circles: list[Circle] = []

    for circle in all_circles:
        keep_circle = True
        for existing_circle in final_circles:
            if existing_circle.circles_overlap(circle):
                if circle.radius > existing_circle.radius:
                    print("Circle removed")
                    final_circles.remove(existing_circle)
                else:
                    keep_circle = False
                    break
        if keep_circle:
            final_circles.append(circle)

    # sorst top to bottom, left to right
    final_circles.sort(key=lambda circle: (circle.y, circle.x))

    # brackets for sizes
    small_nodes = [circle for circle in final_circles if circle.kind == "small"]
    notables = [circle for circle in final_circles if circle.kind == "notable"]
    keystones = [circle for circle in final_circles if circle.kind == "keystone"]

    # draw the final circles and count them
    for circle in small_nodes:
        _ = cv2.circle(image, (circle.x, circle.y), circle.radius, (80, 125, 0), 2)

    for circle in notables:
        _ = cv2.circle(image, (circle.x, circle.y), circle.radius, (100, 255, 0), 2)

    for circle in keystones:
        _ = cv2.circle(image, (circle.x, circle.y), circle.radius, (255, 255, 0), 2)

    # save high res img
    output_filename = "output/poe2_counted.png"
    _ = cv2.imwrite(output_filename, image)

    print(f"Count of small passives: {len(small_nodes)}")
    print(f"Count of notables: {len(notables)}")
    print(f"Count of keystones: {len(keystones)}")
    print(f"Processed image saved as '{output_filename}'.")

    height, width, _ = cast(tuple[int, int, int], image.shape)

    data = {
        "keystones": [
            {
                "id": f"K{index}",
                "x": circle.x / width,
                "y": circle.y / height,
                "kind": "keystone",
            }
            for (index, circle) in enumerate(keystones, start=1)
        ],
        "notables": [
            {
                "id": f"N{index}",
                "x": circle.x / width,
                "y": circle.y / height,
                "kind": "notable",
            }
            for (index, circle) in enumerate(notables, start=1)
        ],
        "smalls": [
            {
                "id": f"S{index}",
                "x": circle.x / width,
                "y": circle.y / height,
                "kind": "small",
            }
            for (index, circle) in enumerate(small_nodes, start=1)
        ],
    }

    # save nodes position
    with open("output/nodes.json", mode="w") as file:
        json.dump(data, file, indent=2)
    print("Generated output/nodes.json")

    # prime nodes description
    with open("output/nodes_desc.json", mode="w") as file:
        json.dump(
            {
                f"K{index}": {"name": f"K{index}", "stats": []}
                for index in range(1, len(keystones) + 1)
            }
            | {
                f"N{index}": {"name": f"N{index}", "stats": []}
                for index in range(1, len(notables) + 1)
            }
            | {
                f"S{index}": {"name": f"S{index}", "stats": []}
                for index in range(1, len(small_nodes) + 1)
            },
            file,
            indent=2,
        )
    print("Generated output/nodes_desc.json")


if __name__ == "__main__":
    main()
