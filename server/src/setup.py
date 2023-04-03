#!/usr/bin/env python
# -*- encoding: utf-8 -*-
# https://godatadriven.com/blog/a-practical-guide-to-using-setup-py/
from setuptools import find_packages
from setuptools import setup

setup(
    name='taurus',
    version='0.1',
    license='',
    description='tools script',
    url='',
    author='Suzanoo',
    author_email='highwaynumber12@gmail.com',
    packages=find_packages(include=['tools', 'tools.*', 'utils', 'utils.*'], exclude=['data']),
    install_requires=[
        'Flask==2.2.2',
        'gunicorn',
        'setuptools',
        'flask_cors==3.0.10',
        'numpy',
        'pandas',
        'geopandas==0.12.2'
    ],
    extras_require={

    },
    setup_requires=['pytest-runner'],
    tests_require=['pytest'],
)

# build package
# Note: create __init__.py in directory you want to create custom library
# % python setup.py install

# install your package
'''The . here refers to the current working directory, which I assume to be the directory
where the setup.py can be found. The -e flag specifies that we want to install
in editable mode, which means
that when we edit the files in our package we do not need to re-install the
package before the changes come into effect. You will need to either restart
python or reload the package though!
pip install -e .
'''
