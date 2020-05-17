from flask import Flask, render_template, request

app = Flask(__name__)
app.config["DEBUG"] = True


@app.route('/convert', methods=['GET', 'POST'])
def convert():
    result = ''
    if request.method == 'POST':
        if request.form['submit'] == "Convert":
            user_input = request.form.get('input')
            if user_input.isdigit():
                doubled_input = int(user_input) * 2
                result = "Your number doubled = {0}".format(doubled_input)
            else:
                result = "Error: please enter a number."
        elif request.form['submit'] == "Clear":
            result = ''
    return render_template("simple_convert.html", result=result)


if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)
