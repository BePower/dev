---
name: agent-template
description: Generate .kiro/agents/dev.json for a project. Use when setting up a new project's Kiro agent configuration.
---

# Agent Template

Generate a `.kiro/agents/dev.json` file tailored to the project.

## Rules

1. Always deny `git commit`, `git push`, `git tag`, `npm publish` in shell
2. For CDK projects: also deny `cdk deploy` and `cdk destroy`
3. Set `autoAllowReadonly: true` on shell
4. `allowedTools` should include everything EXCEPT `write` (write needs approval)
5. `write.allowedPaths` should be project-specific (source dirs, configs, .kiro)
6. Prompt should reference `file://../prompts/dev.md`
7. Resources should include README, steering, and skills
8. Always include `@sonarqube` MCP server (BePower uses SonarCloud for code quality)
9. Use `${SONARQUBE_TOKEN}` env var for auth — never hardcode tokens

## MCP Servers

All BePower projects connect to SonarCloud:

```json
"mcpServers": {
  "sonarqube": {
    "url": "https://api.sonarcloud.io/mcp",
    "headers": {
      "Authorization": "Bearer ${SONARQUBE_TOKEN}",
      "SONARQUBE_ORG": "bepower",
      "SONARQUBE_READ_ONLY": "true"
    }
  }
}
```

## References
- Review `references/base.json` for the common agent structure
- Review `references/example-monorepo-library.json` for npm library projects
- Review `references/example-webapp-vercel.json` for web app projects
- Review `references/example-cdk-app.json` for CDK infrastructure projects
- Review `references/example-ecs-microservice.json` for NestJS/ECS microservice projects
