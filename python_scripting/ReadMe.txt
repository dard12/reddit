This is for local scripting currently to mess around with postgres.
Probably also us this to play with s3.

To use from /interview/python_scripting:

    - have python3 & pip installed
        - TODO fill out those steps

    - then do these commands:
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt

That is basic setup, to play with postgres locally via python,
you should have the postgres app installed:
    command:
        brew install postgres
     then open up app, start it 'initialize'

Once this is done, you can do things like:

    python pg_populator_script.py

That will run the build_and_populate_tables script.


