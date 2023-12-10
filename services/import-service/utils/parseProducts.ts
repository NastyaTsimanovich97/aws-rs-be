import { parse } from 'csv-parse';
import { Readable } from 'node:stream';

export const parseProducts = async (s3File: Readable) => {
  const parser = (s3File)?.pipe(
    parse({
      delimiter: ',',
      columns: true,
      cast: (value: string, context) => {
        const { header, column } = context;

        if (header) return value;

        switch (column) {
          case 'price':
            return parseFloat(value);
          case 'count':
            return parseInt(value);
        }

        return value;
      },
    }),
  );

  const results = [];

  for await (const item of parser) {
    console.log(`item ${JSON.stringify(item)}`);

    results.push(item);
  }

  return results;
};
