'use strict';
var unirest = require('unirest');
const _statusCodeOk = 200;

module.exports.send = (event, context, slsCallback) => {
  requestHandler(event, slsCallback);
};

/* Request Handler */
function requestHandler(event, slsCallback) {
    createCampaigns(event, slsCallback);
}


/* Createa a new mailchiamp campaing */
function createCampaigns(event, slsCallback) {
  var campaignParameters = getCampaignParameters(event.body.subject_line);
  var Request = unirest.post(process.env.mailChimpUrl + '/campaigns')
    .auth(getAuth())
    .type('json')
    .send(campaignParameters)
    .end(function (res) {
      if (res.statusCode === _statusCodeOk) {
        var campaignId = res.raw_body.id;
        setCampaignContent(campaignId, event, slsCallback);
      } else {
        var slsResponse = {
          statusCode: res.status,
          body: res
        };
        slsCallback(null, slsResponse);
      }
    });
}

/* It returns a simple object for a basic mailchimp Campaign  - (see https://developer.mailchimp.com/documentation/mailchimp/reference/campaigns/#create-post_campaigns)  */
function getCampaignParameters(subject_line) {
  return {
    "type": "plaintext",
    "recipients": {
      "list_id": process.env.mailChimpListId,
      "segment_opts": {
        "saved_segment_id": parseInt(process.env.mailChimpSegmentId)
      }
    },
    "settings": {
      "subject_line": subject_line,
      "from_name": process.env.mailChiapEmailFromName,
      "reply_to": process.env.mailChimpReplyTo
    }
  }
}

/* Send the Campaign - (see https://developer.mailchimp.com/documentation/mailchimp/reference/campaigns/#action-post_campaigns_campaign_id_actions_send) */
function sendCampaign(id, event, slsCallback) {
  var Request = unirest.post(process.env.mailChimpUrl + '/campaigns/' + id + '/actions/send')
    .auth(getAuth())
    .end(function (res) {
      //console.log(res);
      if (res.statusCode === _statusCodeOk) {
        var slsResponse = {
          statusCode: _statusCodeOk,
          body: JSON.stringify({
            message: 'Campaign successfully created. ID: ' + campaignId + '. Campaign successfully sent.',
            input: event,
          }),
        };
        slsCallback(null, slsResponse);
      } else {
        var slsResponse = {
          statusCode: res.statusCode,
          body: res
        };
        slsCallback(null, slsResponse);
      }

    });

}
/* Set the Campaign contents - (see https://developer.mailchimp.com/documentation/mailchimp/reference/campaigns/content/#edit-put_campaigns_campaign_id_content) */
function setCampaignContent(id, event, slsCallback) {
  var content = getEmailContent(event);
  var Request = unirest.put(process.env.mailChimpUrl + '/campaigns/' + id + '/content')
    .auth(getAuth())
    .type('json')
    .send(content)
    .end(function (res) {
      if (res.statusCode === _statusCodeOk) {
        sendCampaign(id, event, slsCallback);
      } else {
        var slsResponse = {
          statusCode: res.statusCode,
          body: res
        };
        slsCallback(null, slsResponse);
      }
    });
}

/* Get the email content */
function getEmailContent(event) {
  var plain_text = event.body.plain_text;
  var updateProfileLink = addUpdateProfileLink();
  return {
    "plain_text": plain_text + updateProfileLink 
  }
}

/* Add user update profile link*/
function addUpdateProfileLink() {
  return "\r\n\r\n ============================================== \r\n\r\n Update your profile: *|UPDATE_PROFILE|* \r\n\r\n"
}

/* get Mailchimp authentication object */
function getAuth() {
  return {
    user: 'anystring',
    pass: process.env.mailChimpApi,
    sendImmediately: true
  }
}
