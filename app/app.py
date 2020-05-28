from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
app.config["DEBUG"] = True


@app.route("/", methods=["GET"])
def hello():
    return render_template("form.html")


@app.route("/convert", methods=["POST"])
def convert():
    response = request.get_json()
    result = "Resolution is: {0}x{1}\nData: {2}".format(response["width"], response["height"], response["data"])
    return jsonify({"result": result})


if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
