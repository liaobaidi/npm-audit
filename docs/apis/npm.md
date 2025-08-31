# npm

## npm audit
> 运行`npm audit`的时候调用了什么api？  
### api
- url: https://registry.npmjs.org/-/npm/v1/security/audits
- method: POST
- headers: Content-Type: application/json
- body: 
```json
{
  "name": "your-project-name",
  "version": "18.2.0",
  "requires": {
    [packageName]: packageVersion
  },
  "dependencies": {
    [packageName]: packageVersion
  }
}
```
- response: 
> 内部api，实际返回按实际为准
```json
{
  "auditReportVersion": 2,
  "vulnerabilities": {
    "axios": {
      "name": "axios",
      "severity": "critical", // 严重等级，所有漏洞等级的最大值
      "isDirect": true, // 是否当前项目的直接依赖
      "via": [
        // 如果数组里面是字符串，则说明这个包本身没有漏洞，其漏洞是来自它的依赖, 如：via: ["fetch"]，说明它的漏洞是因为使用了fetch
        // 如果是对象，则说明这个包本身有漏洞，如下：
        {
          "source": 1098, // 漏洞id，npm内部编号
          "name": "axios",
          "title": "axios before 1.7.0 has a prototype pollution vulnerability", // 漏洞标题
          "url": "https://github.com/advisories/GHSA-2g6x-gcvj-v565",
          "severity": "critical", // 严重等级
          "cwe": ["cwe-222"], // 漏洞类型编号，通过此编号可以找到漏洞是如何产生的，会造成什么影响，可以通过 https://cwe.mitre.org/ 查询
          "cvss": { // 严重级别划分，也就是严重等级精细划分
            "score": 6.5,
            "vectorString": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
          }, //
          "cve": ["CVE-222"], // 漏洞编号（通用，包括所有语言），https://www.cve.org/
        }
      ],
      "effects": [ // 该漏洞会影响什么包？也是是谁在使用这个包
        "your-project-name"
      ],
      "range": "<1.7.0", // 漏洞存在的版本范围
      "fixAvailable": {
        "name": "axios",
        "version": "1.7.0",
        "isMajor": true
      },
      "nodes": [ // 漏洞目录
        "node_modules/axios"
      ]
    },
  },
  "metadata": {
    "vulnerabilities": { // 汇总
      "info": 0, // 提示
      "low": 0, // 低
      "moderate": 0, // 中
      "high": 1, // 高
      "critical": 1 // 严重
    },
    "dependencies": 1500,
    "devDependencies": 50,
    "optionalDependencies": 10,
    "totalDependencies": 1560
  },
  "muted": []
}
```