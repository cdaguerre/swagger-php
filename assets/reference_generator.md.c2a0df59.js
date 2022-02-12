import{_ as n,c as s,o as a,a as t}from"./app.92f1b8ee.js";const h='{"title":"Using the Generator","description":"","frontmatter":{},"headers":[{"level":2,"title":"Introduction","slug":"introduction"},{"level":2,"title":"The \\\\OpenApi\\\\scan() function","slug":"the-openapi-scan-function"},{"level":2,"title":"The \\\\OpenApi\\\\Generator class","slug":"the-openapi-generator-class"}],"relativePath":"reference/generator.md","lastUpdated":1644630043853}',e={},p=t(`<h1 id="using-the-generator" tabindex="-1">Using the <code>Generator</code> <a class="header-anchor" href="#using-the-generator" aria-hidden="true">#</a></h1><h2 id="introduction" tabindex="-1">Introduction <a class="header-anchor" href="#introduction" aria-hidden="true">#</a></h2><p>The <code>Generator</code> class provides an object-oriented way to use <code>swagger-php</code> and all its aspects in a single place.</p><h2 id="the-openapi-scan-function" tabindex="-1">The <code>\\OpenApi\\scan()</code> function <a class="header-anchor" href="#the-openapi-scan-function" aria-hidden="true">#</a></h2><p>For a long time the <code>\\OpenApi\\scan()</code> function was the main entry point into using swagger-php from PHP code.</p><div class="language-php"><pre><code><span class="token comment">/**
  * Scan the filesystem for OpenAPI annotations and build openapi-documentation.
  *
  * @param array|Finder|string $directory The directory(s) or filename(s)
  * @param array               $options
  *                                       exclude: string|array $exclude The directory(s) or filename(s) to exclude (as absolute or relative paths)
  *                                       pattern: string       $pattern File pattern(s) to scan (default: *.php)
  *                                       analyser: defaults to StaticAnalyser
  *                                       analysis: defaults to a new Analysis
  *                                       processors: defaults to the registered processors in Analysis
  *
  * @return OpenApi
  */</span>
  <span class="token keyword">function</span> <span class="token function-definition function">scan</span><span class="token punctuation">(</span><span class="token variable">$directory</span><span class="token punctuation">,</span> <span class="token variable">$options</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span>
</code></pre></div><p>Using it looked typically something like this:</p><div class="language-php"><pre><code><span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string double-quoted-string">&quot;vendor/autoload.php&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token variable">$openapi</span> <span class="token operator">=</span> <span class="token function"><span class="token punctuation">\\</span>OpenApi<span class="token punctuation">\\</span>scan</span><span class="token punctuation">(</span><span class="token constant">__DIR__</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string single-quoted-string">&#39;exclude&#39;</span> <span class="token operator">=&gt;</span> <span class="token punctuation">[</span><span class="token string single-quoted-string">&#39;tests&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token string single-quoted-string">&#39;pattern&#39;</span> <span class="token operator">=&gt;</span> <span class="token string single-quoted-string">&#39;*.php&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><p>The two configuration options for the underlying Doctrine doc-block parser <code>aliases</code> and <code>namespaces</code> are not part of this function and need to be set separately.</p><p>Being static this means setting them back is the callers responsibility and there is also the fact that some of the Doctrine configuration currently can not be reverted easily.</p><p>Therefore, having a single side-effect free way of using swwagger-php seemed like a good idea...</p><h2 id="the-openapi-generator-class" tabindex="-1">The <code>\\OpenApi\\Generator</code> class <a class="header-anchor" href="#the-openapi-generator-class" aria-hidden="true">#</a></h2><p>The <code>Generator</code> class can be used in object-oriented (and fluent) style which allows for easy customization if needed.</p><p>In that case to actually process the given input files the <strong>non-static</strong> method <code>generate()</code> is to be used.</p><p>Full example of using the <code>Generator</code> class to generate OpenApi specs.</p><div class="language-php"><pre><code><span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string double-quoted-string">&quot;vendor/autoload.php&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token variable">$validate</span> <span class="token operator">=</span> <span class="token constant boolean">true</span><span class="token punctuation">;</span>
<span class="token variable">$logger</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name class-name-fully-qualified"><span class="token punctuation">\\</span>Psr<span class="token punctuation">\\</span>Log<span class="token punctuation">\\</span>NullLogger</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token variable">$processors</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token comment">/* my processors */</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token variable">$finder</span> <span class="token operator">=</span> <span class="token class-name class-name-fully-qualified static-context"><span class="token punctuation">\\</span>Symfony<span class="token punctuation">\\</span>Component<span class="token punctuation">\\</span>Finder<span class="token punctuation">\\</span>Finder</span><span class="token operator">::</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-&gt;</span><span class="token function">files</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-&gt;</span><span class="token function">name</span><span class="token punctuation">(</span><span class="token string single-quoted-string">&#39;*.php&#39;</span><span class="token punctuation">)</span><span class="token operator">-&gt;</span><span class="token function">in</span><span class="token punctuation">(</span><span class="token constant">__DIR__</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token variable">$openapi</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name class-name-fully-qualified"><span class="token punctuation">\\</span>OpenApi<span class="token punctuation">\\</span>Generator</span><span class="token punctuation">(</span><span class="token variable">$logger</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token operator">-&gt;</span><span class="token function">setProcessors</span><span class="token punctuation">(</span><span class="token variable">$processors</span><span class="token punctuation">)</span>
            <span class="token operator">-&gt;</span><span class="token function">setAliases</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string single-quoted-string">&#39;MY&#39;</span> <span class="token operator">=&gt;</span> <span class="token string single-quoted-string">&#39;My\\Annotations&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
            <span class="token operator">-&gt;</span><span class="token function">setNamespaces</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string single-quoted-string">&#39;My\\\\Annotations\\\\&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
            <span class="token operator">-&gt;</span><span class="token function">setAnalyser</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name class-name-fully-qualified"><span class="token punctuation">\\</span>OpenApi<span class="token punctuation">\\</span>Analysers<span class="token punctuation">\\</span>TokenAnalyser</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token operator">-&gt;</span><span class="token function">setVersion</span><span class="token punctuation">(</span><span class="token class-name class-name-fully-qualified static-context"><span class="token punctuation">\\</span>OpenApi<span class="token punctuation">\\</span>Annotations<span class="token punctuation">\\</span>OpenApi</span><span class="token operator">::</span><span class="token constant">VERSION_3_0_0</span><span class="token punctuation">)</span>
            <span class="token operator">-&gt;</span><span class="token function">generate</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string single-quoted-string">&#39;/path1/to/project&#39;</span><span class="token punctuation">,</span> <span class="token variable">$finder</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name class-name-fully-qualified"><span class="token punctuation">\\</span>OpenApi<span class="token punctuation">\\</span>Analysis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token variable">$validate</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><p><code>Aliases</code> and <code>namespaces</code> are additional options that allow to customize the parsing of docblocks.</p><p>Defaults:</p><ul><li><p><strong>aliases</strong>: <code>[&#39;oa&#39; =&gt; &#39;OpenApi\\\\Annotations&#39;]</code></p><p>Aliases help the underlying <code>doctrine annotations library</code> to parse annotations. Effectively they avoid having to write <code>use OpenApi\\Annotations as OA;</code> in your code and make <code>@OA\\property(..)</code> annotations still work.</p></li><li><p><strong>namespaces</strong>: <code>[&#39;OpenApi\\\\Annotations\\\\&#39;]</code></p><p>Namespaces control which annotation namespaces can be autoloaded automatically. Under the hood this is handled by registering a custom loader with the <code>doctrine annotation library</code>.</p></li></ul><p>Advantages:</p><ul><li>The <code>Generator</code> code will handle configuring things as before in a single place</li><li>Static settings will be reverted to defaults once finished</li><li>The get/set methods allow for using type hints</li><li>Static configuration is deprecated and can be removed at some point without code changes</li><li>Build in support for PSR logger</li><li>Support for <a href="https://symfony.com/doc/current/components/finder.html" target="_blank" rel="noopener noreferrer">Symfony Finder</a>, <code>\\SplInfo</code> and file/directory names (\`string) as source.</li></ul><p>The minimum code required, using the <code>generate()</code> method, looks quite similar to the old <code>scan()</code> code:</p><div class="language-php"><pre><code>    <span class="token comment">/**
     * Generate OpenAPI spec by scanning the given source files.
     *
     * @param iterable      $sources  PHP source files to scan.
     *                                Supported sources:
     *                                * string - file / directory name
     *                                * \\SplFileInfo
     *                                * \\Symfony\\Component\\Finder\\Finder
     * @param null|Analysis $analysis custom analysis instance
     * @param bool          $validate flag to enable/disable validation of the returned spec
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">function</span> <span class="token function-definition function">generate</span><span class="token punctuation">(</span><span class="token keyword type-hint">iterable</span> <span class="token variable">$sources</span><span class="token punctuation">,</span> <span class="token operator">?</span><span class="token class-name type-declaration">Analysis</span> <span class="token variable">$analysis</span> <span class="token operator">=</span> <span class="token constant">null</span><span class="token punctuation">,</span> <span class="token keyword type-hint">bool</span> <span class="token variable">$validate</span> <span class="token operator">=</span> <span class="token constant boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token class-name class-name-fully-qualified return-type"><span class="token punctuation">\\</span>OpenApi<span class="token punctuation">\\</span>OpenApi</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span>
</code></pre></div><div class="language-php"><pre><code><span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string double-quoted-string">&quot;vendor/autoload.php&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token variable">$openapi</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name class-name-fully-qualified"><span class="token punctuation">\\</span>OpenApi<span class="token punctuation">\\</span>Generator</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token operator">-&gt;</span><span class="token function">generate</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string single-quoted-string">&#39;/path1/to/project&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div><p>For those that want to type even less and keep using a plain array to configure <code>swagger-php</code> there is also a static version:</p><div class="language-php"><pre><code><span class="token php language-php"><span class="token delimiter important">&lt;?php</span>
<span class="token keyword">require</span><span class="token punctuation">(</span><span class="token string double-quoted-string">&quot;vendor/autoload.php&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token variable">$openapi</span> <span class="token operator">=</span> <span class="token class-name class-name-fully-qualified static-context"><span class="token punctuation">\\</span>OpenApi<span class="token punctuation">\\</span>Generator</span><span class="token operator">::</span><span class="token function">scan</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string single-quoted-string">&#39;/path/to/project&#39;</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token function">header</span><span class="token punctuation">(</span><span class="token string single-quoted-string">&#39;Content-Type: application/x-yaml&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">echo</span> <span class="token variable">$openapi</span><span class="token operator">-&gt;</span><span class="token function">toYaml</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</span></code></pre></div><p><strong>Note:</strong> While using the same name as the old <code>scan()</code> function, the <code>Generator::scan</code> method is not 100% backwards compatible.</p><div class="language-php"><pre><code>    <span class="token comment">/**
     * Static  wrapper around \`Generator::generate()\`.
     *
     * @param iterable $sources PHP source files to scan.
     *                          Supported sources:
     *                          * string
     *                          * \\SplFileInfo
     *                          * \\Symfony\\Component\\Finder\\Finder
     * @param array    $options
     *                          aliases:    null|array                    Defaults to \`[&#39;oa&#39; =&gt; &#39;OpenApi\\\\Annotations&#39;]\`.
     *                          namespaces: null|array                    Defaults to \`[&#39;OpenApi\\\\Annotations\\\\&#39;]\`.
     *                          analyser:   null|AnalyserInterface        Defaults to a new \`ReflectionAnalyser\` supporting both docblocks and attributes.
     *                          analysis:   null|Analysis                 Defaults to a new \`Analysis\`.
     *                          processors: null|array                    Defaults to \`Analysis::processors()\`.
     *                          logger:     null|\\Psr\\Log\\LoggerInterface If not set logging will use \\OpenApi\\Logger as before.
     *                          validate:   bool                          Defaults to \`true\`.
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">function</span> <span class="token function-definition function">scan</span><span class="token punctuation">(</span><span class="token keyword type-hint">iterable</span> <span class="token variable">$sources</span><span class="token punctuation">,</span> <span class="token keyword type-hint">array</span> <span class="token variable">$options</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token class-name return-type">OpenApi</span> <span class="token punctuation">{</span> <span class="token comment">/* ... */</span> <span class="token punctuation">}</span>
</code></pre></div><p>Most notably the <code>exclude</code> and <code>pattern</code> keys are no longer supported. Instead, a Symfony <code>Finder</code> instance can be passed in as source directly (same as with <code>Generator::generate()</code>).</p><p>If needed, the <code>\\OpenApi\\Util</code> class provides a builder method that allows to keep the status-quo</p><div class="language-php"><pre><code><span class="token variable">$exclude</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string single-quoted-string">&#39;tests&#39;</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token variable">$pattern</span> <span class="token operator">=</span> <span class="token string single-quoted-string">&#39;*.php&#39;</span><span class="token punctuation">;</span>

<span class="token variable">$openapi</span> <span class="token operator">=</span> <span class="token class-name class-name-fully-qualified static-context"><span class="token punctuation">\\</span>OpenApi<span class="token punctuation">\\</span>Generator</span><span class="token operator">::</span><span class="token function">scan</span><span class="token punctuation">(</span><span class="token class-name class-name-fully-qualified static-context"><span class="token punctuation">\\</span>OpenApi<span class="token punctuation">\\</span>Util</span><span class="token operator">::</span><span class="token function">finder</span><span class="token punctuation">(</span><span class="token constant">__DIR__</span><span class="token punctuation">,</span> <span class="token variable">$exclude</span><span class="token punctuation">,</span> <span class="token variable">$pattern</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// same as</span>

<span class="token variable">$openapi</span> <span class="token operator">=</span> <span class="token function"><span class="token punctuation">\\</span>OpenApi<span class="token punctuation">\\</span>scan</span><span class="token punctuation">(</span><span class="token constant">__DIR__</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token string single-quoted-string">&#39;exclude&#39;</span> <span class="token operator">=&gt;</span> <span class="token variable">$exclude</span><span class="token punctuation">,</span> <span class="token string single-quoted-string">&#39;pattern&#39;</span> <span class="token operator">=&gt;</span> <span class="token variable">$pattern</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre></div>`,31),o=[p];function c(l,i,u,r,k,d){return a(),s("div",null,o)}var f=n(e,[["render",c]]);export{h as __pageData,f as default};
