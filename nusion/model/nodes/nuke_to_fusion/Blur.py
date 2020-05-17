
def convert(nuke_effect_attribs):
    """ Convert Nuke Blur to Fusion Blur

    Returns:
        dict with fusion formatted effect attributes.
    """
    fusion_effect_attribs = {}

    for knob in nuke_effect_attribs:
        value = nuke_effect_attribs[knob]
        print(f"From nuke: {knob} {value}")
        if knob == "size":
            if value.startswith("{"):
                fusion_effect_attribs["LockXY"] = "Input {Value = 0, }"
                value = value.replace("{", "").replace("}", "").split(" ")
                fusion_value_x = round(int(value[0]) / 1.9029, 3)
                fusion_value_y = round(int(value[1]) / 1.9029, 3)
                fusion_effect_attribs["XBlurSize"] = f"Input {{ Value = {fusion_value_x}, }}"
                fusion_effect_attribs["YBlurSize"] = f"Input {{ Value = {fusion_value_y}, }}"
            else:
                fusion_value = round(int(value) / 1.9029, 3)
                fusion_effect_attribs["XBlurSize"] = f"Input {{ Value = {fusion_value}, }}"

    return fusion_effect_attribs

if __name__ == '__main__':
    help(convert)
