#!/bin/bash
set -xe

cd "$(dirname "$0")"

cat json/data.json | zap convert json:flat zap/schema.zap AddressBook > zap/data.bin

buf convert protobuf/schema.proto --type pi0.test.AddressBook --from json/data.json > protobuf/data.bin
