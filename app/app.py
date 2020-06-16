from flask import Flask, render_template, request, jsonify
import os
import sys
sys.path.append(os.path.abspath(os.path.join('..', 'nusion')))
from nusion.model import nusion

app = Flask(__name__)
app.config["DEBUG"] = True


@app.route("/", methods=["GET"])
def home():
    return render_template("form.html")


@app.route("/convert", methods=["POST"])
def convert():
    response = request.get_json()
    project = nusion.Project(response)
    try:
        result = project.convert_copy_paste()
    except ValueError as e:
        result = "{}".format(e)

    return jsonify({"result": result})


if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
