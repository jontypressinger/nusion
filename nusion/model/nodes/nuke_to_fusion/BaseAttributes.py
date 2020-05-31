
def convert(node):
    """ Convert Nuke Base Attributes to Fusion Base Attributes

    Returns:
        dict with fusion formatted base attributes.
    """
    fusion_base_attribs = {}

    for knob in node.base_attribs:
        value = node.base_attribs[knob]

        if knob == "xpos" or knob == "ypos":
            fusion_base_attribs["Pos"] = f"ViewInfo = OperatorInfo {{ Pos = {{ {node.base_attribs['xpos']}, {node.base_attribs['ypos']} }} }}"

        if knob == "disable":
            fusion_base_attribs['PassThrough'] = f"PassThrough = {node.base_attribs['disable']}"

    return fusion_base_attribs

if __name__ == '__main__':
    help(convert)
