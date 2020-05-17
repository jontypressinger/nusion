"""
Import all effects from the nodes folder to allow them to be easily called from
other scripts using the node's effect type attribute.
"""

from nodes.nuke_to_fusion import    Blur, \
                                    ColorCorrect

def convert(node_effect, effect_attribs):
    """ List of effect conversion functions """

    if node_effect == "Blur":
        return Blur.convert(effect_attribs)

    if node_effect == "ColorCorrect":
        return ColorCorrect.convert(effect_attribs)

    return "Node effect type not found: {0}".format(node_effect)
