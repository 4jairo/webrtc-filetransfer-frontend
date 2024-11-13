export class OnDisk {
  public static enabled = this.isCompatible()

  public static isCompatible() {
    return 'showSaveFilePicker' in window
  }
  
  static async getWritable(fileName: string) {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: fileName,
    })
  
    return fileHandle.createWritable()
  }
}
