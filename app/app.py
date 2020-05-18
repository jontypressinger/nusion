from flask import Flask, render_template, request

app = Flask(__name__)
app.config["DEBUG"] = True


@app.route("/", methods=["GET"])
def hello():
    return render_template("form.html")


@app.route("/convert", methods=["POST"])
def convert():


    return "Test"


if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
