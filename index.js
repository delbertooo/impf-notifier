const cypress = require('cypress')
const nodemailer = require("nodemailer")
const fs = require('fs').promises
const path = require('path')
const { R_OK } = require('fs').constants


main()
    .then(() => process.exit(0))
    .catch(e => {
        console.error(e)
        process.exit(1)
    })


async function main() {
    const result = await cypress.run({
        spec: 'cypress/integration/check-order.spec.js',
        env: {
        },
    })

    if (result.totalFailed > 0 && has_dates_in_select(result)) {
        const ss = path.join(result.config.screenshotsFolder, 'check-order.spec.js')
        const screenshots = await fs.access(ss, R_OK)
            ? []
            : (await fs.readdir(ss)).map(f => ({ filename: f, path: path.join(ss, f) }))
        console.log(screenshots)

        await send_mail(screenshots)
    } else if (result.totalFailed > 0) {
        console.error(result)
        throw new Error('Some other condition failed.')
    } else {
        console.log('Looks like you still can\'t order :(')
    }

    console.log('Done.')
}


function send_mail(screenshots) {
    console.log('sending Mail')
    const transporter = nodemailer.createTransport(JSON.parse(process.env.NODEMAILER_TRANSPORT))
    const mail = {
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        subject: "Es sind Impftermine verfügbar",
        text: "Es sieht aus als gäbe es jetzt Termine",
        attachments: screenshots,
    }
    if (process.env.DRY_RUN) {
        console.log(mail)
        return
    }
    return transporter.sendMail(mail).finally(e => {
        console.log('Mail result', e)
    });
}

function has_dates_in_select(result) {
    try {
        const errs = result.runs[0].tests.map(t => t.displayError).filter(e => e)
        const hasDates = errs.some(e => e.includes(`, expected '0'`))
        console.log('has_dates_in_select', errs, hasDates)
        return hasDates
    } catch (e) { return false }
}