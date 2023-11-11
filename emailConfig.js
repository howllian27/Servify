import axios from "axios";

const emailjsUserID = 'YOUR_EMAILJS_USER_ID';
const serviceID = 'YOUR_EMAILJS_SERVICE_ID';
const templateID = 'YOUR_EMAILJS_TEMPLATE_ID';

const sendEmail = async (emailParams) => {
  const url = `https://api.emailjs.com/api/v1.0/email/send`;

  const emailData = {
    service_id: serviceID,
    template_id: templateID,
    user_id: emailjsUserID,
    template_params: emailParams
  };

  try {
    const response = await axios.post(url, emailData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = { sendEmail };
