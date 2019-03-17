const express = require('express');
const fetch = require('node-fetch');
const chai = require('chai');

Object.assign(
	global,
	chai,
	{
		express,
		fetch,
	}
);

require('dont-look-up')('./packages');

process.on('unhandledRejection', error => { throw error; });
