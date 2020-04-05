/**
 * Create DNS Record Action for GitHub
 * https://github.com/marketplace/actions/create-dns-record
 */

const path = require("path");
const cp = require("child_process");

const event = require(process.env.GITHUB_EVENT_PATH);
const pr = event.pull_request ? event.pull_request.number : "?";

// https://api.cloudflare.com/#dns-records-for-a-zone-create-dns-record
const result = cp.spawnSync("curl", [
  ...["--request", "POST"],
  ...["--header", `Authorization: Bearer ${process.env.INPUT_TOKEN}`],
  ...["--header", "Content-Type: application/json"],
  ...["--silent", "--data"],
  JSON.stringify({
    type: process.env.INPUT_TYPE,
    name: process.env.INPUT_NAME.replace(/\{pr\}/gi, pr)
      .replace(/\{pr_number\}/gi, pr)
      .replace(/\{head_ref\}/gi, process.env.GITHUB_HEAD_REF),
    content: process.env.INPUT_CONTENT,
    ttl: Number(process.env.INPUT_TTL),
    proxied: Boolean(process.env.INPUT_PROXIED),
  }),
  `https://api.cloudflare.com/client/v4/zones/${process.env.INPUT_ZONE}/dns_records`,
]);

if (result.status !== 0) {
  process.exit(result.status);
}

const { success, result, errors } = JSON.parse(result.stdout.toString());

if (!success) {
  console.dir(errors[0]);
  console.log(`::error ::${errors[0].message}`);
  process.exit(1);
}

console.dir(result);
console.log(`::set-output name=id::${result.id}`);
console.log(`::set-output name=name::${result.name}`);
