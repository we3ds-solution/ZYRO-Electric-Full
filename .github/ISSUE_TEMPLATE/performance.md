---
name: ⚡ Performance/Optimization Issue
about: Report performance problems or optimization opportunities
title: "[PERF] "
labels: 'performance, optimization'
assignees: ''
---

## ⚡ Performance Issue Type
- [ ] Slow page load
- [ ] High memory usage
- [ ] High CPU usage
- [ ] Large bundle size
- [ ] Slow API response
- [ ] Database query performance
- [ ] Network latency
- [ ] Rendering performance
- [ ] Build time performance
- [ ] Other optimization opportunity

## 📊 Current Performance Metrics
<!-- What are the current performance measurements? -->

### Frontend Performance
- **Page Load Time**: <!-- e.g., 5.2s -->
- **First Contentful Paint (FCP)**: <!-- e.g., 1.8s -->
- **Largest Contentful Paint (LCP)**: <!-- e.g., 3.2s -->
- **Cumulative Layout Shift (CLS)**: <!-- e.g., 0.15 -->
- **First Input Delay (FID)**: <!-- e.g., 150ms -->
- **Time to Interactive (TTI)**: <!-- e.g., 4.5s -->
- **Bundle Size**: <!-- e.g., 450KB gzipped -->

### Backend Performance
- **API Response Time**: <!-- e.g., 250ms -->
- **Database Query Time**: <!-- e.g., 150ms -->
- **Server CPU Usage**: <!-- e.g., 45% -->
- **Memory Usage**: <!-- e.g., 512MB -->

### Build Performance
- **Build Time**: <!-- e.g., 2min 30s -->
- **Bundle Analysis**: 
- **Asset Size**: <!-- e.g., 2.5MB -->

## 🎯 Target Performance Goals
<!-- What should the performance be? -->

- **Page Load Time**: <!-- e.g., < 3s -->
- **FCP**: <!-- e.g., < 1.5s -->
- **LCP**: <!-- e.g., < 2.5s -->
- **CLS**: <!-- e.g., < 0.1 -->
- **Bundle Size**: <!-- e.g., < 300KB gzipped -->
- **API Response**: <!-- e.g., < 200ms -->
- **Build Time**: <!-- e.g., < 2min -->

## 📍 Affected Areas
- [ ] Frontend/UI rendering
- [ ] API/Backend endpoint
- [ ] Database queries
- [ ] Build process
- [ ] Docker build
- [ ] Deployment
- [ ] Network/CDN
- [ ] Other

## 🔍 Performance Analysis
<!-- Describe the performance issue in detail -->

### Environment
- **Browser/Device**: <!-- e.g., Chrome on MacBook Pro -->
- **Network**: <!-- e.g., 3G, 4G, Fiber -->
- **Operating System**: 
- **Node.js Version**: 
- **App Version**: 

### Steps to Reproduce Performance Issue
1. 
2. 
3. 

## 📈 Performance Profiling Data
<!-- Include performance profiling results, screenshots, or metrics -->

### Chrome DevTools Results
```
<!-- Paste performance profiling data here -->
```

### Lighthouse Report
```
<!-- Paste Lighthouse audit results -->
```

### Network Waterfall
```
<!-- Describe network requests and timing -->
```

### Bundle Analysis
```
<!-- Show bundle size breakdown if applicable -->
```

## 💡 Suspected Cause
<!-- What do you think is causing the performance issue? -->

### Potential Bottlenecks
- [ ] Large JavaScript bundle
- [ ] Unoptimized images
- [ ] N+1 queries
- [ ] Missing caching
- [ ] Inefficient algorithms
- [ ] Memory leaks
- [ ] Third-party scripts
- [ ] Database performance
- [ ] Other

## 🔧 Proposed Solution
<!-- How would you fix this performance issue? -->

### Optimization Strategies
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Caching strategy
- [ ] Minification/compression
- [ ] Database indexing
- [ ] Query optimization
- [ ] Algorithm optimization
- [ ] Remove unused dependencies
- [ ] Other

### Implementation Details
```
<!-- Describe your proposed optimization approach -->
```

## 📚 References
<!-- Links to performance tools, articles, or best practices -->

- Performance Tool: 
- Benchmark: 
- Related Issue: 
- PR: 

## 🎯 Impact
- **Scope**: 
  - [ ] Frontend
  - [ ] Backend
  - [ ] DevOps/Build
- **User Impact**: <!-- How does this affect users? -->
- **Business Impact**: <!-- SEO, conversion, retention, etc. -->
- **Complexity**: 
  - [ ] Simple (< 2 hours)
  - [ ] Medium (2-8 hours)
  - [ ] Complex (> 8 hours)

## ✅ Checklist
- [ ] I've measured the current performance
- [ ] I've identified performance bottlenecks
- [ ] I've set performance targets
- [ ] I've checked similar issues
- [ ] I've included profiling data
- [ ] I've suggested optimization strategies
- [ ] I understand the scope and complexity
- [ ] This is blocking: 
  - [ ] Users
  - [ ] Development
  - [ ] Deployment
  - [ ] Not blocking

## 💬 Additional Context
<!-- Add any other context or notes here -->

### Success Criteria
- Improve page load time by X%
- Reduce bundle size to X KB
- Achieve Lighthouse score of X
- API response time < X ms
- Other: 

### Monitoring
<!-- How will we measure success? -->
