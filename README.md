# Create DNS Record Action for GitHub

Creates a new CloudFlare DNS record.

## Usage

```yaml
name: example
on:
  pull_request:
    type: [opened, reopened]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: kriasoft/create-dns-record@v1
        with:
          type: "CNAME"
          name: "{PR}-review.example.com"
          content: "example.com"
          ttl: 1
          proxied: true
          token: ${{ secrets.CLOUDFLARE_TOKEN }}
          zone: ${{ secrets.CLOUDFLARE_ZONE }}
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
