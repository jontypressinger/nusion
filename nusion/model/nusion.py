import re
from nusion.model.node import Node

class Nusion:

    def __init__(self, data):
        self.resolution = {"w": int(data["width"]), "h": int(data["height"])}
        self.raw_data = data["data"]

    def convert_copy_paste(self):
        raw_lines = self.raw_data.splitlines()
        for i, line in enumerate(raw_lines):
            if re.match("[A-Z]\w+\s\{", line):
                node = Node.from_nuke(raw_lines[i:], self.resolution)
                node.to_fusion()
                result = f"{{\nTools = ordered() {{\n{node.output()}\n}}\n}}"
                return(result)
