aws dynamodb put-item \
    --table-name tsimanovich-products \
    --item '{
        "id": {"S": "710a0731-509b-4936-8a49-3f966ad8b408"},
        "title": {"S": "Before Sunrise"},
        "description": {"S": "A young man and woman meet on a train in Europe, and wind up spending one evening together in Vienna. Unfortunately, both know that this will probably be their only night together. A young man and woman meet on a train in Europe, and wind up spending one evening together in Vienna."},
        "price": {"N": "2"} }' \
    --return-consumed-capacity TOTAL

aws dynamodb put-item \
    --table-name tsimanovich-products \
    --item '{
        "id": {"S": "277b9732-23f5-44f3-a52c-3beb3520215b"},
        "title": {"S": "Before Sunset"},
        "description": {"S": "The film picks up the story in Before Sunrise of the young American man (Hawke) and French woman (Delpy) who spent a passionate night together in Vienna. Their paths intersect nine years later in Paris, and the film appears to take place in real time as they spend an afternoon together."},
        "price": {"N": "1"} }' \
    --return-consumed-capacity TOTAL

aws dynamodb put-item \
    --table-name tsimanovich-products \
    --item '{
        "id": {"S": "3daad4e1-f7d8-4f49-b31f-7303f5fc2aa0"},
        "title": {"S": "Shrek"},
        "description": {"S": "Shrek is a large, green-skinned, physically intimidating ogre with a Scottish accent. In Shrek Forever After, however, it is revealed that he is much smaller than the average ogre."},
        "price": {"N": "5"} }' \
    --return-consumed-capacity TOTAL

aws dynamodb put-item \
    --table-name tsimanovich-products \
    --item '{
        "id": {"S": "25fe94b5-5426-4ca9-866a-587acd6d29c8"},
        "title": {"S": "Inside Out"},
        "description": {"S": "Inside Out is an animated comedy about a girl named Riley (voice of Kaitlyn Dias), who is uprooted from her life in the US Midwest when her father gets a new job in San Francisco. Riley is largely guided by her emotions, each of which is shown as an actual character."},
        "price": {"N": "4"} }' \
    --return-consumed-capacity TOTAL

aws dynamodb put-item \
    --table-name tsimanovich-products \
    --item '{
        "id": {"S": "26523e33-78c7-40c9-8326-05348f59b1e1"},
        "title": {"S": "The Matrix"},
        "description": {"S": "Neo, a computer programmer and hacker, has always questioned the reality of the world around him. His suspicions are confirmed when Morpheus, a rebel leader, contacts him and reveals the truth to him."},
        "price": {"N": "3"} }' \
    --return-consumed-capacity TOTAL