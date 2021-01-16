/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.PenguinProbe = (function() {

  /**
   * Namespace PenguinProbe.
   * @exports PenguinProbe
   * @namespace
   */
  var PenguinProbe = {};

  /**
   * Language enum.
   * @name PenguinProbe.Language
   * @enum {number}
   * @property {number} ZH_CN=0 ZH_CN value
   * @property {number} EN_US=1 EN_US value
   * @property {number} JA_JP=2 JA_JP value
   * @property {number} KO_KR=3 KO_KR value
   * @property {number} OTHER=4 OTHER value
   */
  PenguinProbe.Language = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "ZH_CN"] = 0;
    values[valuesById[1] = "EN_US"] = 1;
    values[valuesById[2] = "JA_JP"] = 2;
    values[valuesById[3] = "KO_KR"] = 3;
    values[valuesById[4] = "OTHER"] = 4;
    return values;
  })();

  /**
   * Server enum.
   * @name PenguinProbe.Server
   * @enum {number}
   * @property {number} CN=0 CN value
   * @property {number} US=1 US value
   * @property {number} JP=2 JP value
   * @property {number} KR=3 KR value
   */
  PenguinProbe.Server = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "CN"] = 0;
    values[valuesById[1] = "US"] = 1;
    values[valuesById[2] = "JP"] = 2;
    values[valuesById[3] = "KR"] = 3;
    return values;
  })();

  /**
   * MessageType enum.
   * @name PenguinProbe.MessageType
   * @enum {number}
   * @property {number} UNKNOWN=0 UNKNOWN value
   * @property {number} NAVIGATED=1 NAVIGATED value
   * @property {number} ENTERED_SEARCH_RESULT=2 ENTERED_SEARCH_RESULT value
   * @property {number} EXECUTED_ADVANCED_QUERY=3 EXECUTED_ADVANCED_QUERY value
   * @property {number} SERVER_ACK=64 SERVER_ACK value
   */
  PenguinProbe.MessageType = (function() {
    var valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "UNKNOWN"] = 0;
    values[valuesById[1] = "NAVIGATED"] = 1;
    values[valuesById[2] = "ENTERED_SEARCH_RESULT"] = 2;
    values[valuesById[3] = "EXECUTED_ADVANCED_QUERY"] = 3;
    values[valuesById[64] = "SERVER_ACK"] = 64;
    return values;
  })();

  PenguinProbe.Meta = (function() {

    /**
     * Properties of a Meta.
     * @memberof PenguinProbe
     * @interface IMeta
     * @property {PenguinProbe.MessageType|null} [type] Meta type
     * @property {PenguinProbe.Language|null} [language] Meta language
     */

    /**
     * Constructs a new Meta.
     * @memberof PenguinProbe
     * @classdesc Represents a Meta.
     * @implements IMeta
     * @constructor
     * @param {PenguinProbe.IMeta=} [properties] Properties to set
     */
    function Meta(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null)
            this[keys[i]] = properties[keys[i]];
    }

    /**
     * Meta type.
     * @member {PenguinProbe.MessageType} type
     * @memberof PenguinProbe.Meta
     * @instance
     */
    Meta.prototype.type = 0;

    /**
     * Meta language.
     * @member {PenguinProbe.Language} language
     * @memberof PenguinProbe.Meta
     * @instance
     */
    Meta.prototype.language = 0;

    /**
     * Creates a new Meta instance using the specified properties.
     * @function create
     * @memberof PenguinProbe.Meta
     * @static
     * @param {PenguinProbe.IMeta=} [properties] Properties to set
     * @returns {PenguinProbe.Meta} Meta instance
     */
    Meta.create = function create(properties) {
      return new Meta(properties);
    };

    /**
     * Encodes the specified Meta message. Does not implicitly {@link PenguinProbe.Meta.verify|verify} messages.
     * @function encode
     * @memberof PenguinProbe.Meta
     * @static
     * @param {PenguinProbe.IMeta} message Meta message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Meta.encode = function encode(message, writer) {
      if (!writer)
        writer = $Writer.create();
      if (message.type != null && Object.hasOwnProperty.call(message, "type"))
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
      if (message.language != null && Object.hasOwnProperty.call(message, "language"))
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.language);
      return writer;
    };

    /**
     * Encodes the specified Meta message, length delimited. Does not implicitly {@link PenguinProbe.Meta.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PenguinProbe.Meta
     * @static
     * @param {PenguinProbe.IMeta} message Meta message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Meta.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Meta message from the specified reader or buffer.
     * @function decode
     * @memberof PenguinProbe.Meta
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PenguinProbe.Meta} Meta
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Meta.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader))
        reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PenguinProbe.Meta();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.type = reader.int32();
            break;
          case 2:
            message.language = reader.int32();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a Meta message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PenguinProbe.Meta
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PenguinProbe.Meta} Meta
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Meta.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader))
        reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Meta message.
     * @function verify
     * @memberof PenguinProbe.Meta
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Meta.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (message.type != null && message.hasOwnProperty("type"))
        switch (message.type) {
          default:
            return "type: enum value expected";
          case 0:
          case 1:
          case 2:
          case 3:
          case 64:
            break;
        }
      if (message.language != null && message.hasOwnProperty("language"))
        switch (message.language) {
          default:
            return "language: enum value expected";
          case 0:
          case 1:
          case 2:
          case 3:
          case 4:
            break;
        }
      return null;
    };

    /**
     * Creates a Meta message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PenguinProbe.Meta
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PenguinProbe.Meta} Meta
     */
    Meta.fromObject = function fromObject(object) {
      if (object instanceof $root.PenguinProbe.Meta)
        return object;
      var message = new $root.PenguinProbe.Meta();
      switch (object.type) {
        case "UNKNOWN":
        case 0:
          message.type = 0;
          break;
        case "NAVIGATED":
        case 1:
          message.type = 1;
          break;
        case "ENTERED_SEARCH_RESULT":
        case 2:
          message.type = 2;
          break;
        case "EXECUTED_ADVANCED_QUERY":
        case 3:
          message.type = 3;
          break;
        case "SERVER_ACK":
        case 64:
          message.type = 64;
          break;
      }
      switch (object.language) {
        case "ZH_CN":
        case 0:
          message.language = 0;
          break;
        case "EN_US":
        case 1:
          message.language = 1;
          break;
        case "JA_JP":
        case 2:
          message.language = 2;
          break;
        case "KO_KR":
        case 3:
          message.language = 3;
          break;
        case "OTHER":
        case 4:
          message.language = 4;
          break;
      }
      return message;
    };

    /**
     * Creates a plain object from a Meta message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PenguinProbe.Meta
     * @static
     * @param {PenguinProbe.Meta} message Meta
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Meta.toObject = function toObject(message, options) {
      if (!options)
        options = {};
      var object = {};
      if (options.defaults) {
        object.type = options.enums === String ? "UNKNOWN" : 0;
        object.language = options.enums === String ? "ZH_CN" : 0;
      }
      if (message.type != null && message.hasOwnProperty("type"))
        object.type = options.enums === String ? $root.PenguinProbe.MessageType[message.type] : message.type;
      if (message.language != null && message.hasOwnProperty("language"))
        object.language = options.enums === String ? $root.PenguinProbe.Language[message.language] : message.language;
      return object;
    };

    /**
     * Converts this Meta to JSON.
     * @function toJSON
     * @memberof PenguinProbe.Meta
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Meta.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Meta;
  })();

  PenguinProbe.Skeleton = (function() {

    /**
     * Properties of a Skeleton.
     * @memberof PenguinProbe
     * @interface ISkeleton
     * @property {PenguinProbe.IMeta|null} [meta] Skeleton meta
     */

    /**
     * Constructs a new Skeleton.
     * @memberof PenguinProbe
     * @classdesc Represents a Skeleton.
     * @implements ISkeleton
     * @constructor
     * @param {PenguinProbe.ISkeleton=} [properties] Properties to set
     */
    function Skeleton(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null)
            this[keys[i]] = properties[keys[i]];
    }

    /**
     * Skeleton meta.
     * @member {PenguinProbe.IMeta|null|undefined} meta
     * @memberof PenguinProbe.Skeleton
     * @instance
     */
    Skeleton.prototype.meta = null;

    /**
     * Creates a new Skeleton instance using the specified properties.
     * @function create
     * @memberof PenguinProbe.Skeleton
     * @static
     * @param {PenguinProbe.ISkeleton=} [properties] Properties to set
     * @returns {PenguinProbe.Skeleton} Skeleton instance
     */
    Skeleton.create = function create(properties) {
      return new Skeleton(properties);
    };

    /**
     * Encodes the specified Skeleton message. Does not implicitly {@link PenguinProbe.Skeleton.verify|verify} messages.
     * @function encode
     * @memberof PenguinProbe.Skeleton
     * @static
     * @param {PenguinProbe.ISkeleton} message Skeleton message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Skeleton.encode = function encode(message, writer) {
      if (!writer)
        writer = $Writer.create();
      if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
        $root.PenguinProbe.Meta.encode(message.meta, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
      return writer;
    };

    /**
     * Encodes the specified Skeleton message, length delimited. Does not implicitly {@link PenguinProbe.Skeleton.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PenguinProbe.Skeleton
     * @static
     * @param {PenguinProbe.ISkeleton} message Skeleton message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Skeleton.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Skeleton message from the specified reader or buffer.
     * @function decode
     * @memberof PenguinProbe.Skeleton
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PenguinProbe.Skeleton} Skeleton
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Skeleton.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader))
        reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PenguinProbe.Skeleton();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.meta = $root.PenguinProbe.Meta.decode(reader, reader.uint32());
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a Skeleton message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PenguinProbe.Skeleton
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PenguinProbe.Skeleton} Skeleton
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Skeleton.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader))
        reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Skeleton message.
     * @function verify
     * @memberof PenguinProbe.Skeleton
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Skeleton.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (message.meta != null && message.hasOwnProperty("meta")) {
        var error = $root.PenguinProbe.Meta.verify(message.meta);
        if (error)
          return "meta." + error;
      }
      return null;
    };

    /**
     * Creates a Skeleton message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PenguinProbe.Skeleton
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PenguinProbe.Skeleton} Skeleton
     */
    Skeleton.fromObject = function fromObject(object) {
      if (object instanceof $root.PenguinProbe.Skeleton)
        return object;
      var message = new $root.PenguinProbe.Skeleton();
      if (object.meta != null) {
        if (typeof object.meta !== "object")
          throw TypeError(".PenguinProbe.Skeleton.meta: object expected");
        message.meta = $root.PenguinProbe.Meta.fromObject(object.meta);
      }
      return message;
    };

    /**
     * Creates a plain object from a Skeleton message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PenguinProbe.Skeleton
     * @static
     * @param {PenguinProbe.Skeleton} message Skeleton
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Skeleton.toObject = function toObject(message, options) {
      if (!options)
        options = {};
      var object = {};
      if (options.defaults)
        object.meta = null;
      if (message.meta != null && message.hasOwnProperty("meta"))
        object.meta = $root.PenguinProbe.Meta.toObject(message.meta, options);
      return object;
    };

    /**
     * Converts this Skeleton to JSON.
     * @function toJSON
     * @memberof PenguinProbe.Skeleton
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Skeleton.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Skeleton;
  })();

  PenguinProbe.EnteredSearchResult = (function() {

    /**
     * Properties of an EnteredSearchResult.
     * @memberof PenguinProbe
     * @interface IEnteredSearchResult
     * @property {PenguinProbe.IMeta|null} [meta] EnteredSearchResult meta
     * @property {string|null} [stageId] EnteredSearchResult stageId
     * @property {string|null} [itemId] EnteredSearchResult itemId
     * @property {string|null} [query] EnteredSearchResult query
     * @property {number|null} [position] EnteredSearchResult position
     */

    /**
     * Constructs a new EnteredSearchResult.
     * @memberof PenguinProbe
     * @classdesc Represents an EnteredSearchResult.
     * @implements IEnteredSearchResult
     * @constructor
     * @param {PenguinProbe.IEnteredSearchResult=} [properties] Properties to set
     */
    function EnteredSearchResult(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null)
            this[keys[i]] = properties[keys[i]];
    }

    /**
     * EnteredSearchResult meta.
     * @member {PenguinProbe.IMeta|null|undefined} meta
     * @memberof PenguinProbe.EnteredSearchResult
     * @instance
     */
    EnteredSearchResult.prototype.meta = null;

    /**
     * EnteredSearchResult stageId.
     * @member {string} stageId
     * @memberof PenguinProbe.EnteredSearchResult
     * @instance
     */
    EnteredSearchResult.prototype.stageId = "";

    /**
     * EnteredSearchResult itemId.
     * @member {string} itemId
     * @memberof PenguinProbe.EnteredSearchResult
     * @instance
     */
    EnteredSearchResult.prototype.itemId = "";

    /**
     * EnteredSearchResult query.
     * @member {string} query
     * @memberof PenguinProbe.EnteredSearchResult
     * @instance
     */
    EnteredSearchResult.prototype.query = "";

    /**
     * EnteredSearchResult position.
     * @member {number} position
     * @memberof PenguinProbe.EnteredSearchResult
     * @instance
     */
    EnteredSearchResult.prototype.position = 0;

    // OneOf field names bound to virtual getters and setters
    var $oneOfFields;

    /**
     * EnteredSearchResult id.
     * @member {"stageId"|"itemId"|undefined} id
     * @memberof PenguinProbe.EnteredSearchResult
     * @instance
     */
    Object.defineProperty(EnteredSearchResult.prototype, "id", {
      get: $util.oneOfGetter($oneOfFields = ["stageId", "itemId"]),
      set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new EnteredSearchResult instance using the specified properties.
     * @function create
     * @memberof PenguinProbe.EnteredSearchResult
     * @static
     * @param {PenguinProbe.IEnteredSearchResult=} [properties] Properties to set
     * @returns {PenguinProbe.EnteredSearchResult} EnteredSearchResult instance
     */
    EnteredSearchResult.create = function create(properties) {
      return new EnteredSearchResult(properties);
    };

    /**
     * Encodes the specified EnteredSearchResult message. Does not implicitly {@link PenguinProbe.EnteredSearchResult.verify|verify} messages.
     * @function encode
     * @memberof PenguinProbe.EnteredSearchResult
     * @static
     * @param {PenguinProbe.IEnteredSearchResult} message EnteredSearchResult message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EnteredSearchResult.encode = function encode(message, writer) {
      if (!writer)
        writer = $Writer.create();
      if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
        $root.PenguinProbe.Meta.encode(message.meta, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
      if (message.stageId != null && Object.hasOwnProperty.call(message, "stageId"))
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.stageId);
      if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
        writer.uint32(/* id 3, wireType 2 =*/26).string(message.itemId);
      if (message.query != null && Object.hasOwnProperty.call(message, "query"))
        writer.uint32(/* id 4, wireType 2 =*/34).string(message.query);
      if (message.position != null && Object.hasOwnProperty.call(message, "position"))
        writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.position);
      return writer;
    };

    /**
     * Encodes the specified EnteredSearchResult message, length delimited. Does not implicitly {@link PenguinProbe.EnteredSearchResult.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PenguinProbe.EnteredSearchResult
     * @static
     * @param {PenguinProbe.IEnteredSearchResult} message EnteredSearchResult message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    EnteredSearchResult.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an EnteredSearchResult message from the specified reader or buffer.
     * @function decode
     * @memberof PenguinProbe.EnteredSearchResult
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PenguinProbe.EnteredSearchResult} EnteredSearchResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EnteredSearchResult.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader))
        reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PenguinProbe.EnteredSearchResult();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.meta = $root.PenguinProbe.Meta.decode(reader, reader.uint32());
            break;
          case 2:
            message.stageId = reader.string();
            break;
          case 3:
            message.itemId = reader.string();
            break;
          case 4:
            message.query = reader.string();
            break;
          case 5:
            message.position = reader.uint32();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes an EnteredSearchResult message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PenguinProbe.EnteredSearchResult
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PenguinProbe.EnteredSearchResult} EnteredSearchResult
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    EnteredSearchResult.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader))
        reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an EnteredSearchResult message.
     * @function verify
     * @memberof PenguinProbe.EnteredSearchResult
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    EnteredSearchResult.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      var properties = {};
      if (message.meta != null && message.hasOwnProperty("meta")) {
        var error = $root.PenguinProbe.Meta.verify(message.meta);
        if (error)
          return "meta." + error;
      }
      if (message.stageId != null && message.hasOwnProperty("stageId")) {
        properties.id = 1;
        if (!$util.isString(message.stageId))
          return "stageId: string expected";
      }
      if (message.itemId != null && message.hasOwnProperty("itemId")) {
        if (properties.id === 1)
          return "id: multiple values";
        properties.id = 1;
        if (!$util.isString(message.itemId))
          return "itemId: string expected";
      }
      if (message.query != null && message.hasOwnProperty("query"))
        if (!$util.isString(message.query))
          return "query: string expected";
      if (message.position != null && message.hasOwnProperty("position"))
        if (!$util.isInteger(message.position))
          return "position: integer expected";
      return null;
    };

    /**
     * Creates an EnteredSearchResult message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PenguinProbe.EnteredSearchResult
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PenguinProbe.EnteredSearchResult} EnteredSearchResult
     */
    EnteredSearchResult.fromObject = function fromObject(object) {
      if (object instanceof $root.PenguinProbe.EnteredSearchResult)
        return object;
      var message = new $root.PenguinProbe.EnteredSearchResult();
      if (object.meta != null) {
        if (typeof object.meta !== "object")
          throw TypeError(".PenguinProbe.EnteredSearchResult.meta: object expected");
        message.meta = $root.PenguinProbe.Meta.fromObject(object.meta);
      }
      if (object.stageId != null)
        message.stageId = String(object.stageId);
      if (object.itemId != null)
        message.itemId = String(object.itemId);
      if (object.query != null)
        message.query = String(object.query);
      if (object.position != null)
        message.position = object.position >>> 0;
      return message;
    };

    /**
     * Creates a plain object from an EnteredSearchResult message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PenguinProbe.EnteredSearchResult
     * @static
     * @param {PenguinProbe.EnteredSearchResult} message EnteredSearchResult
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    EnteredSearchResult.toObject = function toObject(message, options) {
      if (!options)
        options = {};
      var object = {};
      if (options.defaults) {
        object.meta = null;
        object.query = "";
        object.position = 0;
      }
      if (message.meta != null && message.hasOwnProperty("meta"))
        object.meta = $root.PenguinProbe.Meta.toObject(message.meta, options);
      if (message.stageId != null && message.hasOwnProperty("stageId")) {
        object.stageId = message.stageId;
        if (options.oneofs)
          object.id = "stageId";
      }
      if (message.itemId != null && message.hasOwnProperty("itemId")) {
        object.itemId = message.itemId;
        if (options.oneofs)
          object.id = "itemId";
      }
      if (message.query != null && message.hasOwnProperty("query"))
        object.query = message.query;
      if (message.position != null && message.hasOwnProperty("position"))
        object.position = message.position;
      return object;
    };

    /**
     * Converts this EnteredSearchResult to JSON.
     * @function toJSON
     * @memberof PenguinProbe.EnteredSearchResult
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    EnteredSearchResult.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return EnteredSearchResult;
  })();

  PenguinProbe.ExecutedAdvancedQuery = (function() {

    /**
     * Properties of an ExecutedAdvancedQuery.
     * @memberof PenguinProbe
     * @interface IExecutedAdvancedQuery
     * @property {PenguinProbe.IMeta|null} [meta] ExecutedAdvancedQuery meta
     * @property {Array.<PenguinProbe.ExecutedAdvancedQuery.IAdvancedQuery>|null} [queries] ExecutedAdvancedQuery queries
     */

    /**
     * Constructs a new ExecutedAdvancedQuery.
     * @memberof PenguinProbe
     * @classdesc Represents an ExecutedAdvancedQuery.
     * @implements IExecutedAdvancedQuery
     * @constructor
     * @param {PenguinProbe.IExecutedAdvancedQuery=} [properties] Properties to set
     */
    function ExecutedAdvancedQuery(properties) {
      this.queries = [];
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null)
            this[keys[i]] = properties[keys[i]];
    }

    /**
     * ExecutedAdvancedQuery meta.
     * @member {PenguinProbe.IMeta|null|undefined} meta
     * @memberof PenguinProbe.ExecutedAdvancedQuery
     * @instance
     */
    ExecutedAdvancedQuery.prototype.meta = null;

    /**
     * ExecutedAdvancedQuery queries.
     * @member {Array.<PenguinProbe.ExecutedAdvancedQuery.IAdvancedQuery>} queries
     * @memberof PenguinProbe.ExecutedAdvancedQuery
     * @instance
     */
    ExecutedAdvancedQuery.prototype.queries = $util.emptyArray;

    /**
     * Creates a new ExecutedAdvancedQuery instance using the specified properties.
     * @function create
     * @memberof PenguinProbe.ExecutedAdvancedQuery
     * @static
     * @param {PenguinProbe.IExecutedAdvancedQuery=} [properties] Properties to set
     * @returns {PenguinProbe.ExecutedAdvancedQuery} ExecutedAdvancedQuery instance
     */
    ExecutedAdvancedQuery.create = function create(properties) {
      return new ExecutedAdvancedQuery(properties);
    };

    /**
     * Encodes the specified ExecutedAdvancedQuery message. Does not implicitly {@link PenguinProbe.ExecutedAdvancedQuery.verify|verify} messages.
     * @function encode
     * @memberof PenguinProbe.ExecutedAdvancedQuery
     * @static
     * @param {PenguinProbe.IExecutedAdvancedQuery} message ExecutedAdvancedQuery message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ExecutedAdvancedQuery.encode = function encode(message, writer) {
      if (!writer)
        writer = $Writer.create();
      if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
        $root.PenguinProbe.Meta.encode(message.meta, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
      if (message.queries != null && message.queries.length)
        for (var i = 0; i < message.queries.length; ++i)
          $root.PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery.encode(message.queries[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
      return writer;
    };

    /**
     * Encodes the specified ExecutedAdvancedQuery message, length delimited. Does not implicitly {@link PenguinProbe.ExecutedAdvancedQuery.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PenguinProbe.ExecutedAdvancedQuery
     * @static
     * @param {PenguinProbe.IExecutedAdvancedQuery} message ExecutedAdvancedQuery message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ExecutedAdvancedQuery.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an ExecutedAdvancedQuery message from the specified reader or buffer.
     * @function decode
     * @memberof PenguinProbe.ExecutedAdvancedQuery
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PenguinProbe.ExecutedAdvancedQuery} ExecutedAdvancedQuery
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ExecutedAdvancedQuery.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader))
        reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PenguinProbe.ExecutedAdvancedQuery();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.meta = $root.PenguinProbe.Meta.decode(reader, reader.uint32());
            break;
          case 2:
            if (!(message.queries && message.queries.length))
              message.queries = [];
            message.queries.push($root.PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery.decode(reader, reader.uint32()));
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes an ExecutedAdvancedQuery message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PenguinProbe.ExecutedAdvancedQuery
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PenguinProbe.ExecutedAdvancedQuery} ExecutedAdvancedQuery
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ExecutedAdvancedQuery.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader))
        reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an ExecutedAdvancedQuery message.
     * @function verify
     * @memberof PenguinProbe.ExecutedAdvancedQuery
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ExecutedAdvancedQuery.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (message.meta != null && message.hasOwnProperty("meta")) {
        var error = $root.PenguinProbe.Meta.verify(message.meta);
        if (error)
          return "meta." + error;
      }
      if (message.queries != null && message.hasOwnProperty("queries")) {
        if (!Array.isArray(message.queries))
          return "queries: array expected";
        for (var i = 0; i < message.queries.length; ++i) {
          var error = $root.PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery.verify(message.queries[i]);
          if (error)
            return "queries." + error;
        }
      }
      return null;
    };

    /**
     * Creates an ExecutedAdvancedQuery message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PenguinProbe.ExecutedAdvancedQuery
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PenguinProbe.ExecutedAdvancedQuery} ExecutedAdvancedQuery
     */
    ExecutedAdvancedQuery.fromObject = function fromObject(object) {
      if (object instanceof $root.PenguinProbe.ExecutedAdvancedQuery)
        return object;
      var message = new $root.PenguinProbe.ExecutedAdvancedQuery();
      if (object.meta != null) {
        if (typeof object.meta !== "object")
          throw TypeError(".PenguinProbe.ExecutedAdvancedQuery.meta: object expected");
        message.meta = $root.PenguinProbe.Meta.fromObject(object.meta);
      }
      if (object.queries) {
        if (!Array.isArray(object.queries))
          throw TypeError(".PenguinProbe.ExecutedAdvancedQuery.queries: array expected");
        message.queries = [];
        for (var i = 0; i < object.queries.length; ++i) {
          if (typeof object.queries[i] !== "object")
            throw TypeError(".PenguinProbe.ExecutedAdvancedQuery.queries: object expected");
          message.queries[i] = $root.PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery.fromObject(object.queries[i]);
        }
      }
      return message;
    };

    /**
     * Creates a plain object from an ExecutedAdvancedQuery message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PenguinProbe.ExecutedAdvancedQuery
     * @static
     * @param {PenguinProbe.ExecutedAdvancedQuery} message ExecutedAdvancedQuery
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ExecutedAdvancedQuery.toObject = function toObject(message, options) {
      if (!options)
        options = {};
      var object = {};
      if (options.arrays || options.defaults)
        object.queries = [];
      if (options.defaults)
        object.meta = null;
      if (message.meta != null && message.hasOwnProperty("meta"))
        object.meta = $root.PenguinProbe.Meta.toObject(message.meta, options);
      if (message.queries && message.queries.length) {
        object.queries = [];
        for (var j = 0; j < message.queries.length; ++j)
          object.queries[j] = $root.PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery.toObject(message.queries[j], options);
      }
      return object;
    };

    /**
     * Converts this ExecutedAdvancedQuery to JSON.
     * @function toJSON
     * @memberof PenguinProbe.ExecutedAdvancedQuery
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ExecutedAdvancedQuery.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    ExecutedAdvancedQuery.AdvancedQuery = (function() {

      /**
       * Properties of an AdvancedQuery.
       * @memberof PenguinProbe.ExecutedAdvancedQuery
       * @interface IAdvancedQuery
       * @property {string|null} [stageId] AdvancedQuery stageId
       * @property {Array.<string>|null} [itemIds] AdvancedQuery itemIds
       * @property {PenguinProbe.Server|null} [server] AdvancedQuery server
       * @property {boolean|null} [isPersonal] AdvancedQuery isPersonal
       * @property {number|Long|null} [start] AdvancedQuery start
       * @property {number|Long|null} [end] AdvancedQuery end
       * @property {number|Long|null} [interval] AdvancedQuery interval
       */

      /**
       * Constructs a new AdvancedQuery.
       * @memberof PenguinProbe.ExecutedAdvancedQuery
       * @classdesc Represents an AdvancedQuery.
       * @implements IAdvancedQuery
       * @constructor
       * @param {PenguinProbe.ExecutedAdvancedQuery.IAdvancedQuery=} [properties] Properties to set
       */
      function AdvancedQuery(properties) {
        this.itemIds = [];
        if (properties)
          for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
            if (properties[keys[i]] != null)
              this[keys[i]] = properties[keys[i]];
      }

      /**
       * AdvancedQuery stageId.
       * @member {string} stageId
       * @memberof PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery
       * @instance
       */
      AdvancedQuery.prototype.stageId = "";

      /**
       * AdvancedQuery itemIds.
       * @member {Array.<string>} itemIds
       * @memberof PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery
       * @instance
       */
      AdvancedQuery.prototype.itemIds = $util.emptyArray;

      /**
       * AdvancedQuery server.
       * @member {PenguinProbe.Server} server
       * @memberof PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery
       * @instance
       */
      AdvancedQuery.prototype.server = 0;

      /**
       * AdvancedQuery isPersonal.
       * @member {boolean} isPersonal
       * @memberof PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery
       * @instance
       */
      AdvancedQuery.prototype.isPersonal = false;

      /**
       * AdvancedQuery start.
       * @member {number|Long} start
       * @memberof PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery
       * @instance
       */
      AdvancedQuery.prototype.start = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

      /**
       * AdvancedQuery end.
       * @member {number|Long} end
       * @memberof PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery
       * @instance
       */
      AdvancedQuery.prototype.end = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

      /**
       * AdvancedQuery interval.
       * @member {number|Long} interval
       * @memberof PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery
       * @instance
       */
      AdvancedQuery.prototype.interval = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

      /**
       * Creates a new AdvancedQuery instance using the specified properties.
       * @function create
       * @memberof PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery
       * @static
       * @param {PenguinProbe.ExecutedAdvancedQuery.IAdvancedQuery=} [properties] Properties to set
       * @returns {PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery} AdvancedQuery instance
       */
      AdvancedQuery.create = function create(properties) {
        return new AdvancedQuery(properties);
      };

      /**
       * Encodes the specified AdvancedQuery message. Does not implicitly {@link PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery.verify|verify} messages.
       * @function encode
       * @memberof PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery
       * @static
       * @param {PenguinProbe.ExecutedAdvancedQuery.IAdvancedQuery} message AdvancedQuery message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      AdvancedQuery.encode = function encode(message, writer) {
        if (!writer)
          writer = $Writer.create();
        if (message.stageId != null && Object.hasOwnProperty.call(message, "stageId"))
          writer.uint32(/* id 1, wireType 2 =*/10).string(message.stageId);
        if (message.itemIds != null && message.itemIds.length)
          for (var i = 0; i < message.itemIds.length; ++i)
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.itemIds[i]);
        if (message.server != null && Object.hasOwnProperty.call(message, "server"))
          writer.uint32(/* id 3, wireType 0 =*/24).int32(message.server);
        if (message.isPersonal != null && Object.hasOwnProperty.call(message, "isPersonal"))
          writer.uint32(/* id 4, wireType 0 =*/32).bool(message.isPersonal);
        if (message.start != null && Object.hasOwnProperty.call(message, "start"))
          writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.start);
        if (message.end != null && Object.hasOwnProperty.call(message, "end"))
          writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.end);
        if (message.interval != null && Object.hasOwnProperty.call(message, "interval"))
          writer.uint32(/* id 7, wireType 0 =*/56).uint64(message.interval);
        return writer;
      };

      /**
       * Encodes the specified AdvancedQuery message, length delimited. Does not implicitly {@link PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery.verify|verify} messages.
       * @function encodeDelimited
       * @memberof PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery
       * @static
       * @param {PenguinProbe.ExecutedAdvancedQuery.IAdvancedQuery} message AdvancedQuery message or plain object to encode
       * @param {$protobuf.Writer} [writer] Writer to encode to
       * @returns {$protobuf.Writer} Writer
       */
      AdvancedQuery.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
      };

      /**
       * Decodes an AdvancedQuery message from the specified reader or buffer.
       * @function decode
       * @memberof PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @param {number} [length] Message length if known beforehand
       * @returns {PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery} AdvancedQuery
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      AdvancedQuery.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
          reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery();
        while (reader.pos < end) {
          var tag = reader.uint32();
          switch (tag >>> 3) {
            case 1:
              message.stageId = reader.string();
              break;
            case 2:
              if (!(message.itemIds && message.itemIds.length))
                message.itemIds = [];
              message.itemIds.push(reader.string());
              break;
            case 3:
              message.server = reader.int32();
              break;
            case 4:
              message.isPersonal = reader.bool();
              break;
            case 5:
              message.start = reader.uint64();
              break;
            case 6:
              message.end = reader.uint64();
              break;
            case 7:
              message.interval = reader.uint64();
              break;
            default:
              reader.skipType(tag & 7);
              break;
          }
        }
        return message;
      };

      /**
       * Decodes an AdvancedQuery message from the specified reader or buffer, length delimited.
       * @function decodeDelimited
       * @memberof PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery
       * @static
       * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
       * @returns {PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery} AdvancedQuery
       * @throws {Error} If the payload is not a reader or valid buffer
       * @throws {$protobuf.util.ProtocolError} If required fields are missing
       */
      AdvancedQuery.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
          reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
      };

      /**
       * Verifies an AdvancedQuery message.
       * @function verify
       * @memberof PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery
       * @static
       * @param {Object.<string,*>} message Plain object to verify
       * @returns {string|null} `null` if valid, otherwise the reason why it is not
       */
      AdvancedQuery.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
          return "object expected";
        if (message.stageId != null && message.hasOwnProperty("stageId"))
          if (!$util.isString(message.stageId))
            return "stageId: string expected";
        if (message.itemIds != null && message.hasOwnProperty("itemIds")) {
          if (!Array.isArray(message.itemIds))
            return "itemIds: array expected";
          for (var i = 0; i < message.itemIds.length; ++i)
            if (!$util.isString(message.itemIds[i]))
              return "itemIds: string[] expected";
        }
        if (message.server != null && message.hasOwnProperty("server"))
          switch (message.server) {
            default:
              return "server: enum value expected";
            case 0:
            case 1:
            case 2:
            case 3:
              break;
          }
        if (message.isPersonal != null && message.hasOwnProperty("isPersonal"))
          if (typeof message.isPersonal !== "boolean")
            return "isPersonal: boolean expected";
        if (message.start != null && message.hasOwnProperty("start"))
          if (!$util.isInteger(message.start) && !(message.start && $util.isInteger(message.start.low) && $util.isInteger(message.start.high)))
            return "start: integer|Long expected";
        if (message.end != null && message.hasOwnProperty("end"))
          if (!$util.isInteger(message.end) && !(message.end && $util.isInteger(message.end.low) && $util.isInteger(message.end.high)))
            return "end: integer|Long expected";
        if (message.interval != null && message.hasOwnProperty("interval"))
          if (!$util.isInteger(message.interval) && !(message.interval && $util.isInteger(message.interval.low) && $util.isInteger(message.interval.high)))
            return "interval: integer|Long expected";
        return null;
      };

      /**
       * Creates an AdvancedQuery message from a plain object. Also converts values to their respective internal types.
       * @function fromObject
       * @memberof PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery
       * @static
       * @param {Object.<string,*>} object Plain object
       * @returns {PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery} AdvancedQuery
       */
      AdvancedQuery.fromObject = function fromObject(object) {
        if (object instanceof $root.PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery)
          return object;
        var message = new $root.PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery();
        if (object.stageId != null)
          message.stageId = String(object.stageId);
        if (object.itemIds) {
          if (!Array.isArray(object.itemIds))
            throw TypeError(".PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery.itemIds: array expected");
          message.itemIds = [];
          for (var i = 0; i < object.itemIds.length; ++i)
            message.itemIds[i] = String(object.itemIds[i]);
        }
        switch (object.server) {
          case "CN":
          case 0:
            message.server = 0;
            break;
          case "US":
          case 1:
            message.server = 1;
            break;
          case "JP":
          case 2:
            message.server = 2;
            break;
          case "KR":
          case 3:
            message.server = 3;
            break;
        }
        if (object.isPersonal != null)
          message.isPersonal = Boolean(object.isPersonal);
        if (object.start != null)
          if ($util.Long)
            (message.start = $util.Long.fromValue(object.start)).unsigned = true;
          else if (typeof object.start === "string")
            message.start = parseInt(object.start, 10);
          else if (typeof object.start === "number")
            message.start = object.start;
          else if (typeof object.start === "object")
            message.start = new $util.LongBits(object.start.low >>> 0, object.start.high >>> 0).toNumber(true);
        if (object.end != null)
          if ($util.Long)
            (message.end = $util.Long.fromValue(object.end)).unsigned = true;
          else if (typeof object.end === "string")
            message.end = parseInt(object.end, 10);
          else if (typeof object.end === "number")
            message.end = object.end;
          else if (typeof object.end === "object")
            message.end = new $util.LongBits(object.end.low >>> 0, object.end.high >>> 0).toNumber(true);
        if (object.interval != null)
          if ($util.Long)
            (message.interval = $util.Long.fromValue(object.interval)).unsigned = true;
          else if (typeof object.interval === "string")
            message.interval = parseInt(object.interval, 10);
          else if (typeof object.interval === "number")
            message.interval = object.interval;
          else if (typeof object.interval === "object")
            message.interval = new $util.LongBits(object.interval.low >>> 0, object.interval.high >>> 0).toNumber(true);
        return message;
      };

      /**
       * Creates a plain object from an AdvancedQuery message. Also converts values to other types if specified.
       * @function toObject
       * @memberof PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery
       * @static
       * @param {PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery} message AdvancedQuery
       * @param {$protobuf.IConversionOptions} [options] Conversion options
       * @returns {Object.<string,*>} Plain object
       */
      AdvancedQuery.toObject = function toObject(message, options) {
        if (!options)
          options = {};
        var object = {};
        if (options.arrays || options.defaults)
          object.itemIds = [];
        if (options.defaults) {
          object.stageId = "";
          object.server = options.enums === String ? "CN" : 0;
          object.isPersonal = false;
          if ($util.Long) {
            var long = new $util.Long(0, 0, true);
            object.start = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
          } else
            object.start = options.longs === String ? "0" : 0;
          if ($util.Long) {
            var long = new $util.Long(0, 0, true);
            object.end = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
          } else
            object.end = options.longs === String ? "0" : 0;
          if ($util.Long) {
            var long = new $util.Long(0, 0, true);
            object.interval = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
          } else
            object.interval = options.longs === String ? "0" : 0;
        }
        if (message.stageId != null && message.hasOwnProperty("stageId"))
          object.stageId = message.stageId;
        if (message.itemIds && message.itemIds.length) {
          object.itemIds = [];
          for (var j = 0; j < message.itemIds.length; ++j)
            object.itemIds[j] = message.itemIds[j];
        }
        if (message.server != null && message.hasOwnProperty("server"))
          object.server = options.enums === String ? $root.PenguinProbe.Server[message.server] : message.server;
        if (message.isPersonal != null && message.hasOwnProperty("isPersonal"))
          object.isPersonal = message.isPersonal;
        if (message.start != null && message.hasOwnProperty("start"))
          if (typeof message.start === "number")
            object.start = options.longs === String ? String(message.start) : message.start;
          else
            object.start = options.longs === String ? $util.Long.prototype.toString.call(message.start) : options.longs === Number ? new $util.LongBits(message.start.low >>> 0, message.start.high >>> 0).toNumber(true) : message.start;
        if (message.end != null && message.hasOwnProperty("end"))
          if (typeof message.end === "number")
            object.end = options.longs === String ? String(message.end) : message.end;
          else
            object.end = options.longs === String ? $util.Long.prototype.toString.call(message.end) : options.longs === Number ? new $util.LongBits(message.end.low >>> 0, message.end.high >>> 0).toNumber(true) : message.end;
        if (message.interval != null && message.hasOwnProperty("interval"))
          if (typeof message.interval === "number")
            object.interval = options.longs === String ? String(message.interval) : message.interval;
          else
            object.interval = options.longs === String ? $util.Long.prototype.toString.call(message.interval) : options.longs === Number ? new $util.LongBits(message.interval.low >>> 0, message.interval.high >>> 0).toNumber(true) : message.interval;
        return object;
      };

      /**
       * Converts this AdvancedQuery to JSON.
       * @function toJSON
       * @memberof PenguinProbe.ExecutedAdvancedQuery.AdvancedQuery
       * @instance
       * @returns {Object.<string,*>} JSON object
       */
      AdvancedQuery.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
      };

      return AdvancedQuery;
    })();

    return ExecutedAdvancedQuery;
  })();

  PenguinProbe.Navigated = (function() {

    /**
     * Properties of a Navigated.
     * @memberof PenguinProbe
     * @interface INavigated
     * @property {PenguinProbe.IMeta|null} [meta] Navigated meta
     * @property {string|null} [path] Navigated path
     */

    /**
     * Constructs a new Navigated.
     * @memberof PenguinProbe
     * @classdesc Represents a Navigated.
     * @implements INavigated
     * @constructor
     * @param {PenguinProbe.INavigated=} [properties] Properties to set
     */
    function Navigated(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null)
            this[keys[i]] = properties[keys[i]];
    }

    /**
     * Navigated meta.
     * @member {PenguinProbe.IMeta|null|undefined} meta
     * @memberof PenguinProbe.Navigated
     * @instance
     */
    Navigated.prototype.meta = null;

    /**
     * Navigated path.
     * @member {string} path
     * @memberof PenguinProbe.Navigated
     * @instance
     */
    Navigated.prototype.path = "";

    /**
     * Creates a new Navigated instance using the specified properties.
     * @function create
     * @memberof PenguinProbe.Navigated
     * @static
     * @param {PenguinProbe.INavigated=} [properties] Properties to set
     * @returns {PenguinProbe.Navigated} Navigated instance
     */
    Navigated.create = function create(properties) {
      return new Navigated(properties);
    };

    /**
     * Encodes the specified Navigated message. Does not implicitly {@link PenguinProbe.Navigated.verify|verify} messages.
     * @function encode
     * @memberof PenguinProbe.Navigated
     * @static
     * @param {PenguinProbe.INavigated} message Navigated message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Navigated.encode = function encode(message, writer) {
      if (!writer)
        writer = $Writer.create();
      if (message.meta != null && Object.hasOwnProperty.call(message, "meta"))
        $root.PenguinProbe.Meta.encode(message.meta, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
      if (message.path != null && Object.hasOwnProperty.call(message, "path"))
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.path);
      return writer;
    };

    /**
     * Encodes the specified Navigated message, length delimited. Does not implicitly {@link PenguinProbe.Navigated.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PenguinProbe.Navigated
     * @static
     * @param {PenguinProbe.INavigated} message Navigated message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Navigated.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Navigated message from the specified reader or buffer.
     * @function decode
     * @memberof PenguinProbe.Navigated
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PenguinProbe.Navigated} Navigated
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Navigated.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader))
        reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PenguinProbe.Navigated();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.meta = $root.PenguinProbe.Meta.decode(reader, reader.uint32());
            break;
          case 2:
            message.path = reader.string();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a Navigated message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PenguinProbe.Navigated
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PenguinProbe.Navigated} Navigated
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Navigated.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader))
        reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Navigated message.
     * @function verify
     * @memberof PenguinProbe.Navigated
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Navigated.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (message.meta != null && message.hasOwnProperty("meta")) {
        var error = $root.PenguinProbe.Meta.verify(message.meta);
        if (error)
          return "meta." + error;
      }
      if (message.path != null && message.hasOwnProperty("path"))
        if (!$util.isString(message.path))
          return "path: string expected";
      return null;
    };

    /**
     * Creates a Navigated message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PenguinProbe.Navigated
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PenguinProbe.Navigated} Navigated
     */
    Navigated.fromObject = function fromObject(object) {
      if (object instanceof $root.PenguinProbe.Navigated)
        return object;
      var message = new $root.PenguinProbe.Navigated();
      if (object.meta != null) {
        if (typeof object.meta !== "object")
          throw TypeError(".PenguinProbe.Navigated.meta: object expected");
        message.meta = $root.PenguinProbe.Meta.fromObject(object.meta);
      }
      if (object.path != null)
        message.path = String(object.path);
      return message;
    };

    /**
     * Creates a plain object from a Navigated message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PenguinProbe.Navigated
     * @static
     * @param {PenguinProbe.Navigated} message Navigated
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Navigated.toObject = function toObject(message, options) {
      if (!options)
        options = {};
      var object = {};
      if (options.defaults) {
        object.meta = null;
        object.path = "";
      }
      if (message.meta != null && message.hasOwnProperty("meta"))
        object.meta = $root.PenguinProbe.Meta.toObject(message.meta, options);
      if (message.path != null && message.hasOwnProperty("path"))
        object.path = message.path;
      return object;
    };

    /**
     * Converts this Navigated to JSON.
     * @function toJSON
     * @memberof PenguinProbe.Navigated
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Navigated.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Navigated;
  })();

  PenguinProbe.ServerACK = (function() {

    /**
     * Properties of a ServerACK.
     * @memberof PenguinProbe
     * @interface IServerACK
     * @property {PenguinProbe.MessageType|null} [type] ServerACK type
     * @property {string|null} [message] ServerACK message
     */

    /**
     * Constructs a new ServerACK.
     * @memberof PenguinProbe
     * @classdesc Represents a ServerACK.
     * @implements IServerACK
     * @constructor
     * @param {PenguinProbe.IServerACK=} [properties] Properties to set
     */
    function ServerACK(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null)
            this[keys[i]] = properties[keys[i]];
    }

    /**
     * ServerACK type.
     * @member {PenguinProbe.MessageType} type
     * @memberof PenguinProbe.ServerACK
     * @instance
     */
    ServerACK.prototype.type = 0;

    /**
     * ServerACK message.
     * @member {string} message
     * @memberof PenguinProbe.ServerACK
     * @instance
     */
    ServerACK.prototype.message = "";

    /**
     * Creates a new ServerACK instance using the specified properties.
     * @function create
     * @memberof PenguinProbe.ServerACK
     * @static
     * @param {PenguinProbe.IServerACK=} [properties] Properties to set
     * @returns {PenguinProbe.ServerACK} ServerACK instance
     */
    ServerACK.create = function create(properties) {
      return new ServerACK(properties);
    };

    /**
     * Encodes the specified ServerACK message. Does not implicitly {@link PenguinProbe.ServerACK.verify|verify} messages.
     * @function encode
     * @memberof PenguinProbe.ServerACK
     * @static
     * @param {PenguinProbe.IServerACK} message ServerACK message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ServerACK.encode = function encode(message, writer) {
      if (!writer)
        writer = $Writer.create();
      if (message.type != null && Object.hasOwnProperty.call(message, "type"))
        writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
      if (message.message != null && Object.hasOwnProperty.call(message, "message"))
        writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
      return writer;
    };

    /**
     * Encodes the specified ServerACK message, length delimited. Does not implicitly {@link PenguinProbe.ServerACK.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PenguinProbe.ServerACK
     * @static
     * @param {PenguinProbe.IServerACK} message ServerACK message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ServerACK.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ServerACK message from the specified reader or buffer.
     * @function decode
     * @memberof PenguinProbe.ServerACK
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PenguinProbe.ServerACK} ServerACK
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ServerACK.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader))
        reader = $Reader.create(reader);
      var end = length === undefined ? reader.len : reader.pos + length, message = new $root.PenguinProbe.ServerACK();
      while (reader.pos < end) {
        var tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.type = reader.int32();
            break;
          case 2:
            message.message = reader.string();
            break;
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a ServerACK message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PenguinProbe.ServerACK
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PenguinProbe.ServerACK} ServerACK
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ServerACK.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader))
        reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ServerACK message.
     * @function verify
     * @memberof PenguinProbe.ServerACK
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ServerACK.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (message.type != null && message.hasOwnProperty("type"))
        switch (message.type) {
          default:
            return "type: enum value expected";
          case 0:
          case 1:
          case 2:
          case 3:
          case 64:
            break;
        }
      if (message.message != null && message.hasOwnProperty("message"))
        if (!$util.isString(message.message))
          return "message: string expected";
      return null;
    };

    /**
     * Creates a ServerACK message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PenguinProbe.ServerACK
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PenguinProbe.ServerACK} ServerACK
     */
    ServerACK.fromObject = function fromObject(object) {
      if (object instanceof $root.PenguinProbe.ServerACK)
        return object;
      var message = new $root.PenguinProbe.ServerACK();
      switch (object.type) {
        case "UNKNOWN":
        case 0:
          message.type = 0;
          break;
        case "NAVIGATED":
        case 1:
          message.type = 1;
          break;
        case "ENTERED_SEARCH_RESULT":
        case 2:
          message.type = 2;
          break;
        case "EXECUTED_ADVANCED_QUERY":
        case 3:
          message.type = 3;
          break;
        case "SERVER_ACK":
        case 64:
          message.type = 64;
          break;
      }
      if (object.message != null)
        message.message = String(object.message);
      return message;
    };

    /**
     * Creates a plain object from a ServerACK message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PenguinProbe.ServerACK
     * @static
     * @param {PenguinProbe.ServerACK} message ServerACK
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ServerACK.toObject = function toObject(message, options) {
      if (!options)
        options = {};
      var object = {};
      if (options.defaults) {
        object.type = options.enums === String ? "UNKNOWN" : 0;
        object.message = "";
      }
      if (message.type != null && message.hasOwnProperty("type"))
        object.type = options.enums === String ? $root.PenguinProbe.MessageType[message.type] : message.type;
      if (message.message != null && message.hasOwnProperty("message"))
        object.message = message.message;
      return object;
    };

    /**
     * Converts this ServerACK to JSON.
     * @function toJSON
     * @memberof PenguinProbe.ServerACK
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ServerACK.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ServerACK;
  })();

  return PenguinProbe;
})();

module.exports = $root;
