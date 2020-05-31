"""

blur_conversion_ratio = 1000x1000 square with 10 blur radius in nuke

1k square 10blur to 1920 20blur:

1920/1000 = 1.920
20/10 = 2
6.890909 * 2 = 13.781818
13.781818 / 1.920 = 7.17803020833

1k square 10blur to 4096 50blur:
6.890909 * 5 = 34.454545
4096/1000 = 4.096
34.454545 / 4.096 = 8.41175415039

"""


def convert(node):
    """ Convert Nuke Blur to Fusion Blur

    Returns:
        dict with fusion formatted effect attributes.
    """

    ratio_base_resolution = 1000
    base_ratio = 6.890909

    conversion_ratio_x = node.resolution["w"] / ratio_base_resolution
    conversion_ratio_y = node.resolution["h"] / ratio_base_resolution

    nuke_effect_attribs = node.effect_attribs
    fusion_effect_attribs = {}

    for knob in nuke_effect_attribs:
        value = nuke_effect_attribs[knob]
        if knob == "size":
            if value.startswith("{"): # Blur scale is not uniform.
                fusion_effect_attribs["LockXY"] = "Input {Value = 0, }"
                value = value.replace("{", "").replace("}", "").split(" ")
                blur_size_nuke_x = int(value[0])
                blur_size_nuke_y = int(value[1])
                fusion_value_x = round((base_ratio * (blur_size_nuke_x / 10)) / conversion_ratio_x, 5)
                fusion_value_y = round((base_ratio * (blur_size_nuke_y / 10)) / conversion_ratio_x, 5)
                fusion_effect_attribs["XBlurSize"] = f"Input {{ Value = {fusion_value_x}, }}"
                fusion_effect_attribs["YBlurSize"] = f"Input {{ Value = {fusion_value_y}, }}"
            else: # Blur scale is uniform.
                blur_size_nuke = int(value)
                fusion_value = round((base_ratio * (blur_size_nuke / 10)) / conversion_ratio_x, 5)
                fusion_effect_attribs["XBlurSize"] = f"Input {{ Value = {fusion_value}, }}"

    return fusion_effect_attribs

if __name__ == '__main__':
    help(convert)
