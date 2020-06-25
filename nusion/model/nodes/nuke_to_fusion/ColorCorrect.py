# pylint: disable=invalid-name, missing-module-docstring
# Disable pylint invalid name warning as this files is named to match the Nuke node.

def convert(node):
    """ Convert Nuke ColorCorrect to Fusion ColorCorrector

    Returns:
        dict with fusion formatted effect attributes.
    """
    fusion_effect_attribs = {}
    nuke_effect_attribs = node.effect_attribs

    for knob in nuke_effect_attribs:
        value = nuke_effect_attribs[knob]

        if knob == "gain":
            if value.startswith("{"): # Multiple channels
                split_value = value.replace("{", "").replace("}", "").split(" ")
                fusion_effect_attribs["MasterRedGain"] = f"Input {{Value = {split_value[1]}, }}"
                fusion_effect_attribs["MasterGreenGain"] = f"Input {{Value = {split_value[2]}, }}"
                fusion_effect_attribs["MasterBlueGain"] = f"Input {{Value = {split_value[3]}, }}"
            else: #Master channel
                fusion_effect_attribs["MasterRGBGain"] = f"Input {{Value = {value}, }}"

    return fusion_effect_attribs

if __name__ == '__main__':
    help(convert)
