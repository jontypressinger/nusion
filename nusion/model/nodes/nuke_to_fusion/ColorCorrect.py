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

        if ".gain" in knob:
            #TODO: Raise warning about ranges curve making this conversion not 100% accurate.
            fusion_knob = knob.split(".")[0].capitalize()
            if fusion_knob == "Midtones":
                fusion_knob = "MidTones" #Exception for Fusion's weird capitalisation
            if value.startswith("{"): # Multiple channels
                split_value = value.replace("{", "").replace("}", "").split(" ")
                fusion_effect_attribs[f"{fusion_knob}RedGain"] = \
                    f"Input {{Value = {split_value[1]}, }}"
                fusion_effect_attribs[f"{fusion_knob}GreenGain"] = \
                    f"Input {{Value = {split_value[2]}, }}"
                fusion_effect_attribs[f"{fusion_knob}BlueGain"] = \
                    f"Input {{Value = {split_value[3]}, }}"
            else: #Master channel
                fusion_effect_attribs[f"{fusion_knob}RGBGain"] = f"Input {{Value = {value}, }}"

        #Match nuke default Ranges curve
        fusion_effect_attribs["ColorRanges"] = \
                "Input { Value = ColorCurves " \
                "{ Curves = { " \
                "{ Points = { { 0, 1 }, { 0.0288, 0.9956 }, { 0.0611, 0 }, { 0.09, 0 } } }, " \
				"{ Points = { { 0.5, 0 }, { 0.6772, 0 }, { 0.8189, 1 }, { 1, 1 } } } } }, }"

    return fusion_effect_attribs

if __name__ == '__main__':
    help(convert)
