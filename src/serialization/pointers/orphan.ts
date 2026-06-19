import {
  PTR_ADOPT_WRONG_MESSAGE,
  PTR_ALREADY_ADOPTED,
  PTR_INVALID_POINTER_TYPE,
} from "../../errors";
import { format } from "../../util";
import { ListElementSize } from "../list-element-size";
import { ObjectSize, getWordLength } from "../object-size";
import { Segment } from "../segment";
import {
  getTargetListLength,
  getTargetStructSize,
  getTargetPointerType,
  getTargetListElementSize,
  getTargetCompositeListSize,
  getCapabilityId,
  getContent,
  erasePointer,
  initPointer,
  erase,
  setStructPointer,
  setListPointer,
  setInterfacePointer,
  getListByteLength,
} from "./pointer.utils";
import { Pointer, PointerType } from "./pointer";

export interface _Orphan {
  capId: number;
  elementSize: ListElementSize;
  length: number;
  size: ObjectSize;
  type: PointerType;
}

// Technically speaking this class doesn't need to be generic, but the extra type checking enforced by this helps to
// make sure you don't accidentally adopt a pointer of the wrong type.

/**
 * An orphaned pointer. This object itself is technically a pointer to the original pointer's content, which was left
 * untouched in its original message. The original pointer data is encoded as attributes on the Orphan object, ready to
 * be reconstructed once another pointer is ready to adopt it.
 */
export class Orphan<T extends Pointer> {
  /** If this member is not present then the orphan has already been adopted, or something went very wrong. */
  _zap?: _Orphan;

  byteOffset: number;
  segment: Segment;

  constructor(src: T) {
    const c = getContent(src);

    this.segment = c.segment;
    this.byteOffset = c.byteOffset;

    this._zap = {} as _Orphan;

    // Read vital info from the src pointer so we can reconstruct it during adoption.
    this._zap.type = getTargetPointerType(src);

    switch (this._zap.type) {
      case PointerType.STRUCT: {
        this._zap.size = getTargetStructSize(src);

        break;
      }

      case PointerType.LIST: {
        this._zap.length = getTargetListLength(src);
        this._zap.elementSize = getTargetListElementSize(src);

        if (this._zap.elementSize === ListElementSize.COMPOSITE) {
          this._zap.size = getTargetCompositeListSize(src);
        }

        break;
      }

      case PointerType.OTHER: {
        this._zap.capId = getCapabilityId(src);

        break;
      }

      default: {
        // COVERAGE: Unreachable code.
        /* istanbul ignore next */
        throw new Error(PTR_INVALID_POINTER_TYPE);
      }
    }

    // Zero out the source pointer (but not the contents!).
    erasePointer(src);
  }

  /**
   * Adopt (move) this orphan into the target pointer location. This will allocate far pointers in `dst` as needed.
   *
   * @param dst The destination pointer.
   */
  _moveTo(dst: T): void {
    if (this._zap === undefined) {
      throw new Error(format(PTR_ALREADY_ADOPTED, this));
    }

    // TODO: Implement copy semantics when this happens.
    if (this.segment.message !== dst.segment.message) {
      throw new Error(format(PTR_ADOPT_WRONG_MESSAGE, this, dst));
    }

    // Recursively wipe out the destination pointer first.
    erase(dst);

    const res = initPointer(this.segment, this.byteOffset, dst);

    switch (this._zap.type) {
      case PointerType.STRUCT: {
        setStructPointer(res.offsetWords, this._zap.size, res.pointer);
        break;
      }

      case PointerType.LIST: {
        let { offsetWords } = res;

        if (this._zap.elementSize === ListElementSize.COMPOSITE) {
          offsetWords--; // The tag word gets skipped.
        }

        setListPointer(
          offsetWords,
          this._zap.elementSize,
          this._zap.length,
          res.pointer,
          this._zap.size,
        );
        break;
      }

      case PointerType.OTHER: {
        setInterfacePointer(this._zap.capId, res.pointer);
        break;
      }

      /* istanbul ignore next */
      default: {
        throw new Error(PTR_INVALID_POINTER_TYPE);
      }
    }

    this._zap = undefined;
  }

  dispose(): void {
    // FIXME: Should this throw?
    if (this._zap === undefined) {
      return;
    }

    switch (this._zap.type) {
      case PointerType.STRUCT: {
        this.segment.fillZeroWords(
          this.byteOffset,
          getWordLength(this._zap.size),
        );
        break;
      }

      case PointerType.LIST: {
        const byteLength = getListByteLength(
          this._zap.elementSize,
          this._zap.length,
          this._zap.size,
        );
        this.segment.fillZeroWords(this.byteOffset, byteLength);
        break;
      }
      default: {
        // Other pointer types don't actually have any content.
        break;
      }
    }

    this._zap = undefined;
  }

  [Symbol.for("nodejs.util.inspect.custom")](): string {
    return format(
      "Orphan_%d@%a,type:%s",
      this.segment.id,
      this.byteOffset,
      this._zap && this._zap.type,
    );
  }
}
