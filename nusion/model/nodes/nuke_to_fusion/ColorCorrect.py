# pylint: disable=invalid-name, missing-module-docstring
# Disable pylint invalid name warning as this files is named to match the Nuke node.

def convert(node):
    """ Convert Nuke ColorCorrect to Fusion ColorCorrector

    Returns:
        dict with fusion formatted effect attributes.
    """
    fusion_effect_attribs = {}
    nuke_effect_attribs = node.effect_attribs

    fusion_effect_attribs[0] = "This is currently a placeholder effect."
    return fusion_effect_attribs

if __name__ == '__main__':
    help(convert)
