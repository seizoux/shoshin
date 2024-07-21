function maskEmail(email) {
    const [name, domain] = email.split("@");
    if (name.length <= 2) {
      return email; // Too short to mask, return as is
    }
    const maskedName = name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
    return maskedName + "@" + domain;
}


const email = document.getElementById('_sho-mng-email-field').value;
const maskedEmail = maskEmail(email);
document.getElementById('_sho-mng-email-field').value = maskedEmail;