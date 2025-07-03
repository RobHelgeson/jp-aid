# Database Schema

The following Cypher commands define the schema for Memgraph. Specifically, they create indexes on the `id` property for each node type. Indexing this property is critical for fast lookups when querying for a specific Kanji, Radical, or Primitive by its character or name.

These commands are idempotent and should be applied to the database instance upon initialization.

```cypher
-- Create an index on the 'id' property for Kanji nodes
CREATE INDEX ON :Kanji(id);

-- Create an index on the 'id' property for Radical nodes
CREATE INDEX ON :Radical(id);

-- Create an index on the 'id' property for Primitive nodes
CREATE INDEX ON :Primitive(id);
```
