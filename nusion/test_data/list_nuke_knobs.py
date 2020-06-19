"""
Run in nuke script editor to list all knobs on selected node.
"""

for knob in nuke.selectedNode().knobs():
    print knob