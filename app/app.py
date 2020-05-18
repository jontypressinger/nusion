from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
app.config["DEBUG"] = True


@app.route("/", methods=["GET"])
def hello():
    return render_template("form.html")


@app.route("/convert", methods=["POST"])
def convert():
    response = request.get_json()
    result = response["data"]
    return jsonify({"data": result})


if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
