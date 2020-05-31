"""
Import all effects from the nodes folder to allow them to be easily called from
other scripts using the node's effect type attribute.
"""

from nusion.model.nodes.nuke_to_fusion import   BaseAttributes, \
                                                Blur, \
                                                ColorCorrect

def convert(node):
    """ List of effect conversion functions """

    base_attribs = BaseAttributes.convert(node)

    if node.effect == "Blur":
        return base_attribs, Blur.convert(node)

    if node.effect == "ColorCorrect":
        return base_attribs, ColorCorrect.convert(node)

    raise ValueError("Node effect type not found: {0}".format(node.effect))
