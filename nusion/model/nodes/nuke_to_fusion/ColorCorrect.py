
def convert(nuke_effect_attribs):
    """ Convert Nuke ColorCorrect to Fusion ColorCorrector

    Returns:
        dict with fusion formatted effect attributes.
    """
    fusion_effect_attribs = {}

    fusion_effect_attribs[0] = "This is currently a placeholder effect."
    return fusion_effect_attribs

if __name__ == '__main__':
    help(convert)
