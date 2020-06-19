
def convert(node):
    """ Convert Nuke common effect attributes to Fusion

    Returns:
        dict with fusion formatted common attributes.
    """
    
    nuke_effect_attribs = node.effect_attribs
    fusion_effect_attribs = {}
    
    for knob in nuke_effect_attribs:
        value = nuke_effect_attribs[knob]

        if knob == "mix":
            fusion_effect_attribs["Blend"] = f"Input {{ Value = {value}, }}"

    return fusion_effect_attribs

if __name__ == '__main__':
    help(convert)
