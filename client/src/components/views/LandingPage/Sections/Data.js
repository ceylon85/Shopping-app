const continents = [
    {
        "_id": 1,
        "name": "아프리카"
    },
    {
        "_id": 2,
        "name": "유럽"
    },
    {
        "_id": 3,
        "name": "아시아"
    },
    {
        "_id": 4,
        "name": "북미 지역"
    },
    {
        "_id": 5,
        "name": "남미 지역"
    },
    {
        "_id": 6,
        "name": "호주"
    },
    {
        "_id": 7,
        "name": "남극 대륙"
    }

]

const price = [
    {
        "_id": 0,
        "name": "전체",
        "array": []
    },
    {
        "_id": 1,
        "name": "$0 to $199",
        "array": [0, 199]
    },
    {
        "_id": 2,
        "name": "$200 to $249",
        "array": [200, 249]
    },
    {
        "_id": 3,
        "name": "$250 to $279",
        "array": [250, 279]
    },
    {
        "_id": 4,
        "name": "$280 to $299",
        "array": [280, 299]
    },
    {
        "_id": 5,
        "name": "More than $300",
        "array": [300, 1500000]
    }
]

export {
    continents,
    price
}