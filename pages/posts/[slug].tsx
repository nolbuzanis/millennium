/* eslint-disable react/jsx-props-no-spreading */
import styled from 'styled-components';
import { GetStaticPaths, GetStaticProps } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import Head from 'next/head';
import { getAllPosts, getPostBySlug } from '../../utils/api';

// components
import StyledP from '../../components/article/paragraph';
import StyledHeroImage from '../../components/article/hero-image';
import Header from '../../components/article/header';
import HeadingTwo from '../../components/article/heading-two';
import CodeBlock from '../../components/article/code-block';
import HeadingThree from '../../components/article/heading-three';
import UnorderedList from '../../components/article/unordered-list';

interface PostProps {
  post: Post;
}

const components = {
  p: (props) => <StyledP {...props} />,
  h2: (props) => <HeadingTwo {...props} />,
  pre: (props) => <CodeBlock {...props} />,
  h3: (props) => <HeadingThree {...props} />,
  ul: (props) => <UnorderedList {...props} />,
};

const MDXContainer = styled.article`
  position: relative;
  padding: 160px 0px 35px 68px;
  transition: background 0.2s linear 0s;
`;

const PostPage = (props: PostProps): JSX.Element => {
  const { post } = props;
  return (
    <div>
      <Head>
        <title>{post.title}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta charSet='utf-8' />
        {/* Twitter */}
        <meta name='twitter:card' content='summary' key='twcard' />
        <meta name='twitter:creator' content='@NBuzanis' key='twhandle' />
        {/* Open Graph */}
        <meta name='description' content={post.excerpt} />
        <meta property='og:title' content={post.title} key='ogtitle' />
        <meta property='og:description' content={post.excerpt} key='ogdesc' />
        <meta property='og:image' content={post.hero} key='ogimage' />
      </Head>
      <Header title={post.title} />
      <StyledHeroImage src={post.hero} alt={post.title} />
      <MDXContainer>
        <MDXRemote {...post.content} components={components} />
      </MDXContainer>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = getPostBySlug(params.slug as string, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'hero',
    'excerpt',
    'readingTime',
  ]);
  // const content = await markdownToHtml(post.content || '');
  const content = await serialize(post.content || '');

  return {
    props: {
      post: {
        ...post,
        content,
        mdxContent: content,
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts(['slug']);

  return {
    paths: posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    })),
    fallback: false,
  };
};

export default PostPage;
