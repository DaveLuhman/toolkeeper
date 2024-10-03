import sgMail from '@sendgrid/mail'
import { createToken, sendResetPwEmail, sendEmail, getDomainFromEmail } from './util';

jest.mock('@sendgrid/mail');

describe('createToken', () => {
  it('should expose a function', () => {
		expect(createToken).toBeDefined();
	});

  it('createToken should return expected output', () => {
    const retValue = createToken();
    expect(retValue).toBeTruthy();
  });
});
describe('sendResetPwEmail', () => {
  it('should expose a function', () => {
		expect(sendResetPwEmail).toBeDefined();
	});

  it('sendResetPwEmail should return expected output', async () => {
    const email = "pretend@email.com"
    const token = "abc123abc"
    await sendResetPwEmail(email,token);
    expect(sendResetPwEmail).toHaveBeenCalled();
  });
});
describe('sendEmail', () => {
  it('should expose a function', () => {
		expect(sendEmail).toBeDefined();
	});

  it('sendEmail should return expected output', async () => {
    const to = "Pretend@gmail.com"
    const subject = "This is a pretend Email Subject"
    const body = "This is a pretend email body."
    const retValue = await sendEmail(to,subject,body);
    expect(retValue).toBeDefined;
  });
});
describe('getDomainFromEmail', () => {
  it('should expose a function', () => {
		expect(getDomainFromEmail).toBeDefined();
	});

  it('getDomainFromEmail should return expected output', () => {
    const email = "pretend@gmail.com"
    const retValue = getDomainFromEmail(email);
    expect(retValue).toBe('gmail.com');
  });
});