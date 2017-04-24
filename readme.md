# Description
This project uses [Serverless] (https://serverless.com/) to create a public endpoint (/send) where you can make POST calls to send mail via the [MailChimp] service (https://mailchimp.com/). The POST calls must be made by specifying the following parameters (text and object of the email) in the request body:

```json
{
	"plain_text":"Email content plain text",
	"subject_line":"Email object"
}
```

Emails will be sent to a [Segment] (https://developer.mailchimp.com/documentation/mailchimp/reference/lists/segments/) of a [List] (https://developer.mailchimp.com/documentation/mailchimp/References/lists /) specified in the configuration file (env.yml).

# Configuration
Create a Mailchimp account, create a List of Users for your Campaing, and take a Segment of your users and then enter the following values into the Serverless environment variable configuration file:

1. mailChimpApiUrl // Mailchimp API Url
2. mailChimpApiKey: // Mailchimp API  Key
3. mailChimpListId: // Mailchimp List Id 
4. mailChimpSegmentId: // Mailchimp Segment Id 
5. mailChiapEmailFromName: // Mailchimp Email 'From' name 
6. mailChimpReplyTo: // Mailchimp email Address

# Run on localhost

### Install dependencies
```
npm install
```

### Use [Serverless Offline Plugin] (https://github.com/dherault/serverless-offline):
```
sls offline
```

### Call the resource and send email:
```curl
curl -H "Content-Type: application/json" -X POST -d '{"plain_text":"Email content plaintext.","subject_line":"Email subject"}' http://localhost:3000/send
```

# Load on Amazon Api Gateway via Serverless
```
sls deploy --stage dev --region eu-central-1 -v
```
It will return the online endpoint url, use it to make the POST calls and send your email.