create table blogs (
  id serial primary key,
  author text,
  url text not null,
  title text not null,
  likes integer not null default 0
);

insert into blogs (author, url, title) values ('Test Author', 'http://example.com', 'New Blog');

insert into blogs (author, url, title) values ('Test Author', 'http://example.com', 'Another new Blog');