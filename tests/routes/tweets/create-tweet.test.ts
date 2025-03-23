import { createExpressServer } from '../../../src/express.server';
import { UserMock } from '../../mock/user.mock';
import { runAuthTests } from "../helpers/test-auth-helper";

describe('POST /tweets', () => {
	const server = createExpressServer();
	const endpoint = '/tweets';
	const userMock = UserMock.build();

    runAuthTests({ server, method: 'post', endpoint });
});
