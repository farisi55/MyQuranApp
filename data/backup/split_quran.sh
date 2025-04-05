#!/bin/bash

# File input
INPUT_FILE="quran.json"

# File output
SURAH_FILE="surahs.json"
OUTPUT_DIR="surah_data"

# Pastikan direktori output ada
mkdir -p "$OUTPUT_DIR"

# Ekstrak daftar surah ke surahs_list.json
jq '[.[] | {number, name, translation, numberOfAyahs, revelation, description}]' "$INPUT_FILE" > "$SURAH_FILE"

# Loop untuk setiap surah dan buat file JSON per surah
jq -c '.[]' "$INPUT_FILE" | while read -r surah; do
    number=$(echo "$surah" | jq '.number')
    echo "$surah" | jq '{number, name, ayahs}' > "$OUTPUT_DIR/surah_${number}.json"
done

echo "Splitting selesai! Data tersimpan di '$SURAH_FILE' dan folder '$OUTPUT_DIR'."
