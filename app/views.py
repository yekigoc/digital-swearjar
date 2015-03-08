# -*- coding: utf-8 -*-
from __future__ import division
from datetime import timedelta
from flask import Flask, Response
from flask import make_response, request, current_app
from flask import render_template, redirect, jsonify
from functools import update_wrapper
from app import app
import requests
import json
import os.path

def root_dir():  # pragma: no cover
    return os.path.abspath(os.path.dirname(__file__))

def get_file(filename):  # pragma: no cover
    try:
        src = os.path.join(root_dir(), filename)
        # Figure out how flask returns static files
        # Tried:
        # - render_template
        # - send_file
        # This should not be so non-obvious
        return open(src).read()
    except IOError as exc:
        return str(exc)

#The base html page, nothing here yet
@app.route("/")
def hello():
    content = get_file('../index.html')
    return Response(content, mimetype="text/html")

#API Call to show balance
@app.route("/balance",methods=['POST'])
def show_balance():
    payload = {'password':request.form['password']}
    guid = request.form['guid']

    baseurl = "https://blockchain.info/merchant/"+request.form['guid']+"/balance"
    r = requests.post(baseurl,data=payload)
    jsondata = r.json()
    return jsonify(**jsondata)

    #balance = str((jsondata['balance']) / 100000000)
    #return balance

#API call to send payments to other accounts
@app.route("/payment", methods=['POST'])
def make_payment():
    payload = {
            password:request.form['password'], 
            to:request.form['to'], 
            note:request.form.get('note', "")    
    }
    guid = request.form['guid']    

    baseurl = "https://blockchain.info/merchant/"+guid+"/payment"
    r = requests.post(baseurl,data=payload)
    jsondata = r.json()
    return jsonify(**jsondata)

@app.route("/create_wallet")
def create_wallet():
    payload = {
            password: request.form['password'],
            email: requet.form.get('email', ""),
            label: request.form.get('label', ""),
    }

    baseurl = "https://blockchain.info/api/v2/create_wallet"
    r = requests.get(baseurl)
    try:
        jsondata = r.json()
    except Exception as e:
        print "Error: ", e

    return jsonify(**jsondata)

@app.route("/new_address")
def new_address(guid, password, label):
    payload = {
            password: request.form['password'],
            label: request.form.get('label', "")
    }
    guid = request.form['guid']

    baseurl = "https://blockchain.info/merchant/"+guid+"/new_address"

    r = requests.get(baseurl)
    jsondata = r.json()
    return jsonify(**jsondata)
