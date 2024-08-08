# Manage Deploy Action 

배포된 프로젝트 버전 관리를 위한 Github Action 

Notion DB에서 관리된다


## USAGE
```yaml
notify:
runs-on: ubuntu-latest
steps:
  - name: Checkout the current branch
    uses: actions/checkout@v3

  - name: Commit Hash
    id: commit
    uses: pr-mpt/actions-commit-hash@v2

  - name: Use Node.js ${{ matrix.node-version }}
    uses: actions/setup-node@v1
    with:
      node-version: ${{ matrix.node-version }}

  - name: Updation Notion Version
    uses: hypercloud-kr/manage-deploy-action@v0
    with:
        project: 'HARS API'
        version: ${{ steps.commit.outputs.hash }}
        database_id: ${{ secrets.DEPLOY_NOTION_DATABASE_ID }}
        notion_token: ${{ secrets.NOTION_TOKEN }}
```