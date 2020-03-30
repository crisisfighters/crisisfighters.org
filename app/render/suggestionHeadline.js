const suggestionHeadline = (caption, index) => 
`<h1>${index ? `${cfStrings.recruiter.general.suggestionHeadlinePrefix} ${index}: ` : ''}
  <span class="headline">${caption}</span>
</h1>`;

export default suggestionHeadline;