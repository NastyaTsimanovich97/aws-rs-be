aws dynamodb put-item \
    --table-name tsimanovich-stocks \
    --item '{
        "product_id": {"S": "710a0731-509b-4936-8a49-3f966ad8b408"},
        "count": {"N": "100"} }' \
    --return-consumed-capacity TOTAL

aws dynamodb put-item \
    --table-name tsimanovich-stocks \
    --item '{
        "product_id": {"S": "277b9732-23f5-44f3-a52c-3beb3520215b"},
        "count": {"N": "12"} }' \
    --return-consumed-capacity TOTAL

aws dynamodb put-item \
    --table-name tsimanovich-stocks \
    --item '{
        "product_id": {"S": "3daad4e1-f7d8-4f49-b31f-7303f5fc2aa0"},
        "count": {"N": "53"} }' \
    --return-consumed-capacity TOTAL

aws dynamodb put-item \
    --table-name tsimanovich-stocks \
    --item '{
        "product_id": {"S": "25fe94b5-5426-4ca9-866a-587acd6d29c8"},
        "count": {"N": "27"} }' \
    --return-consumed-capacity TOTAL

aws dynamodb put-item \
    --table-name tsimanovich-stocks \
    --item '{
        "product_id": {"S": "26523e33-78c7-40c9-8326-05348f59b1e1"},
        "count": {"N": "30"} }' \
    --return-consumed-capacity TOTAL