# pylint: disable=invalid-name, missing-module-docstring
# Disable pylint invalid name warning as this files is named to match the Nuke node.

def convert(node):
    """ Convert Nuke Transform to Fusion Transform

    Returns:
        dict with fusion formatted effect attributes.
    """

    nuke_effect_attribs = node.effect_attribs
    fusion_effect_attribs = {}

    fusion_effect_attribs["ReferenceSize"] = "Input {Value = 1, }"
    fusion_effect_attribs["Width"] = f"Input {{Value = {node.root_width}, }}"
    fusion_effect_attribs["Height"] = f"Input {{Value = {node.root_height}, }}"

    for knob in nuke_effect_attribs:
        value = nuke_effect_attribs[knob]

        if knob == "rotate":
            fusion_effect_attribs["Angle"] = f"Input {{Value = {value}, }}"

        if knob == "invert_matrix":
            if value == "true":
                fusion_effect_attribs["InvertTransform"] = "Input {Value = 1, }"

        if knob == "center":
            value = value.replace("{", "").replace("}", "").split(" ")
            nuke_center_x = float(value[0])
            nuke_center_y = float(value[1])
            fusion_center_x = nuke_center_x / node.root_width
            fusion_center_y = nuke_center_y / node.root_height
            fusion_effect_attribs["Pivot"] = \
                f"Input {{Value = {{ {fusion_center_x}, {fusion_center_y} }}, }}"

        if knob == "translate":
            value = value.replace("{", "").replace("}", "").split(" ")
            nuke_translate_x = float(value[0])
            nuke_translate_y = float(value[1])
            fusion_translate_x = \
                ((node.root_width / 2) + nuke_translate_x) / node.root_width
            fusion_translate_y = \
               ((node.root_height / 2) + nuke_translate_y) / node.root_height
            fusion_effect_attribs["Center"] = \
                f"Input {{Value = {{ {fusion_translate_x}, {fusion_translate_y} }}, }}"

    return fusion_effect_attribs

if __name__ == '__main__':
    help(convert)
