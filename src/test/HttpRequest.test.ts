import { AssertionError } from 'assert';
import * as chai from 'chai';
import * as querystring from 'querystring';
import { httpClient } from '..';
import { CUSTOM_ERROR_NAME, OBJECT_ERROR_URL, server, STRING_ERROR_URL, VALID_URL } from './app';
const PORT = 25000;
const HOST = 'http://localhost';
const QUERYSTRING = 'awesome=true';
const PARSED_QUERYSTRING = querystring.parse(QUERYSTRING);
const NOT_FOUND_URL = '/bar/hello/world';
const BODY = {
  awesome: 'band',
  foo: 'fighters',
  is: 'an',
};
const DELETE = 'DELETE';
const GET = 'GET';
const OPTIONS = 'OPTIONS';
const PATCH = 'PATCH';
const POST = 'POST';
const PUT = 'PUT';
const TRACE = 'TRACE';

chai.should();

// Our parent block
describe('Http request promise simple', () => {
  before(async () => {
    server.listen(PORT);
  });

  after(async () => {
    server.close();
  });

  describe(`Error Handling`, () => {
    it('should throw an error if passed a data parameter that is not an object', async () => {
      let res;
      try {
        res = await httpClient.request(`${HOST}:${PORT}${NOT_FOUND_URL}?${QUERYSTRING}`, 'dfssdf');
      } catch (error) {
        res = error;
      }
      res.should.be.an.instanceof(AssertionError);
    });

    it('it should handle 404 errors', async () => {
      let res;
      try {
        res = await httpClient.get(`${HOST}:${PORT}${NOT_FOUND_URL}?${QUERYSTRING}`);
      } catch (error) {
        res = error;
      }
      res.status.should.be.eql(404);
      res.should.be.an.instanceof(Object);
    });

    it('it should handle custom errors passed as strings', async () => {
      let res;
      try {
        res = await httpClient.get(`${HOST}:${PORT}${STRING_ERROR_URL}?${QUERYSTRING}`);
      } catch (error) {
        res = error;
      }
      res.status.should.be.eql(400);
    });

    it('it should handle custom errors passed as objects', async () => {
      let res;
      try {
        res = await httpClient.get(`${HOST}:${PORT}${OBJECT_ERROR_URL}?${QUERYSTRING}`);
      } catch (error) {
        res = error;
      }
      res.status.should.be.eql(400);
      res.should.be.an.instanceof(Object);
      res.data.name.should.be.eql(CUSTOM_ERROR_NAME);
    });
  });

  describe(`GET Requests`, () => {
    it('it should make a GET request successfully', async () => {
      const res = await httpClient.get(`${HOST}:${PORT}${VALID_URL}?${QUERYSTRING}`);
      res.status.should.be.eql(200);
      res.should.be.an.instanceof(Object);
      res.data.reqPath.should.be.eql(VALID_URL);
      res.data.reqQueryString.should.be.eql(PARSED_QUERYSTRING);
      res.data.reqMethod.should.be.eql(GET);
      res.data.reqBody.should.be.eql({});
    });
  });

  describe(`HEAD Requests`, () => {
    it('it should make a HEAD request successfully', async () => {
      const res = await httpClient.head(`${HOST}:${PORT}${VALID_URL}?${QUERYSTRING}`);
      res.should.be.an.instanceof(Object);
      res.status.should.be.eql(200);
    });
  });

  describe(`OPTIONS Requests`, () => {
    it('it should make a OPTIONS request successfully', async () => {
      const res = await httpClient.options(`${HOST}:${PORT}${VALID_URL}?${QUERYSTRING}`);
      res.status.should.be.eql(200);
      res.should.be.an.instanceof(Object);
      res.data.reqPath.should.be.eql(VALID_URL);
      res.data.reqQueryString.should.be.eql(PARSED_QUERYSTRING);
      res.data.reqMethod.should.be.eql(OPTIONS);
      res.data.reqBody.should.be.eql({});
    });
  });

  describe(`TRACE Requests`, () => {
    it('it should make a TRACE request successfully', async () => {
      const res = await httpClient.trace(`${HOST}:${PORT}${VALID_URL}?${QUERYSTRING}`);
      res.status.should.be.eql(200);
      res.should.be.an.instanceof(Object);
      res.data.reqPath.should.be.eql(VALID_URL);
      res.data.reqQueryString.should.be.eql(PARSED_QUERYSTRING);
      res.data.reqMethod.should.be.eql(TRACE);
      res.data.reqBody.should.be.eql({});
    });
  });

  describe(`Data parsing for Requests`, () => {
    it('it should make a POST request successfully with data being an object', async () => {
      const res = await httpClient.post(`${HOST}:${PORT}${VALID_URL}?${QUERYSTRING}`, BODY);
      res.status.should.be.eql(200);
      res.should.be.an.instanceof(Object);
      res.data.reqPath.should.be.eql(VALID_URL);
      res.data.reqQueryString.should.be.eql(PARSED_QUERYSTRING);
      res.data.reqMethod.should.be.eql(POST);
      res.data.reqBody.foo.should.be.eql('fighters');
      res.data.reqBody.is.should.be.eql('an');
      res.data.reqBody.awesome.should.be.eql('band');
    });
  });

  describe(`POST Requests`, () => {
    it('it should make a POST request successfully', async () => {
      const res = await httpClient.post(`${HOST}:${PORT}${VALID_URL}?${QUERYSTRING}`, BODY);
      res.status.should.be.eql(200);
      res.should.be.an.instanceof(Object);
      res.data.reqPath.should.be.eql(VALID_URL);
      res.data.reqQueryString.should.be.eql(PARSED_QUERYSTRING);
      res.data.reqMethod.should.be.eql(POST);
      res.data.reqBody.foo.should.be.eql('fighters');
      res.data.reqBody.is.should.be.eql('an');
      res.data.reqBody.awesome.should.be.eql('band');
    });
  });

  describe(`PATCH Requests`, () => {
    it('it should make a PATCH request successfully', async () => {
      const res = await httpClient.patch(`${HOST}:${PORT}${VALID_URL}?${QUERYSTRING}`, BODY);
      res.status.should.be.eql(200);
      res.should.be.an.instanceof(Object);
      res.data.reqPath.should.be.eql(VALID_URL);
      res.data.reqQueryString.should.be.eql(PARSED_QUERYSTRING);
      res.data.reqMethod.should.be.eql(PATCH);
      res.data.reqBody.foo.should.be.eql('fighters');
      res.data.reqBody.is.should.be.eql('an');
      res.data.reqBody.awesome.should.be.eql('band');
    });
  });

  describe(`PUT Requests`, () => {
    it('it should make a PUT request successfully', async () => {
      const res = await httpClient.put(`${HOST}:${PORT}${VALID_URL}?${QUERYSTRING}`, BODY);
      res.status.should.be.eql(200);
      res.should.be.an.instanceof(Object);
      res.data.reqPath.should.be.eql(VALID_URL);
      res.data.reqQueryString.should.be.eql(PARSED_QUERYSTRING);
      res.data.reqMethod.should.be.eql(PUT);
      res.data.reqBody.foo.should.be.eql('fighters');
      res.data.reqBody.is.should.be.eql('an');
      res.data.reqBody.awesome.should.be.eql('band');
    });
  });

  describe(`DELETE Requests`, () => {
    it('it should make a DELETE request successfully', async () => {
      const res = await httpClient.delete(`${HOST}:${PORT}${VALID_URL}?${QUERYSTRING}`);
      res.status.should.be.eql(200);
      res.should.be.an.instanceof(Object);
      res.data.reqPath.should.be.eql(VALID_URL);
      res.data.reqQueryString.should.be.eql(PARSED_QUERYSTRING);
      res.data.reqMethod.should.be.eql(DELETE);
      res.data.reqBody.should.be.eql({});
    });
  });
});
