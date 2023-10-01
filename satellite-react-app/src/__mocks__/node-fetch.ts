// src/__mocks__/node-fetch.ts

const fetchMock = jest.fn();

const mockResponse = (status: number, statusText: string, response: string) => {
  return new window.Response(response, {
    status: status,
    statusText: statusText,
    headers: {
      'Content-type': 'application/json'
    }
  });
};

fetchMock.mockResolvedValue(mockResponse(200, 'OK', JSON.stringify([{id: 1, name: 'Company A'}, {id: 2, name: 'Company B'}])));

export default fetchMock;

