/**
 * Manages the bluetooth servers that are available to the user. The user will make a request to connect to a device.
 * On connection, we will connect to the device's GATT server. The server is then added to this list, and
 * then specific services and characteristics can be accessed from paper program code.
 */
import paperLand from './paperLand.js';

const boardBluetoothServers = {

  /**
   * The list of servers that are available to the user. Maps a bluetooth device to a GATT server.
   * This way we can remove all servers when a device disconnects. Only one server per device.
   */
  deviceServerMap: new Map(),

  /**
   * Adds a server to the list of available servers.
   * @param {BluetoothDevice} device
   * @param {BluetoothRemoteGATTServer} server
   */
  addServer( device, server ) {
    this.deviceServerMap.set( device, server );
  },

  /**
   * Remove the server associated with the provided device.
   * @param device
   */
  clearServerForDevice( device ) {
    this.deviceServerMap.delete( device );
  },

  /**
   * Get the server associated with the provided device.
   */
  getServerForDevice( device ) {
    return this.deviceServerMap.get( device );
  },

  /**
   * Get the characteristic for the specified service and characteristic UUIDs. This will search through all
   * connected servers until it finds the correct service and characteristic. Pulled out in case we want to
   * retry connecting to a characteristic if the first attempt fails (but that hasn't seemed necessary yet).
   */
  async makeAttemptToGetCharacteristic( serviceUUID, characteristicUUID ) {
    for ( let [ device, server ] of phet.paperLand.boardBluetoothServers.deviceServerMap ) {
      try {
        const service = await server.getPrimaryService( serviceUUID );
        return await service.getCharacteristic( characteristicUUID );
      }
      catch( error ) {
        // Continue trying with the next server instead of immediately throwing
      }
    }
  },

  /**
   * Get the characteristic for the specified service and characteristic UUIDs. This will search through all
   * connected servers until it finds the correct service and characteristic.
   * @returns {Promise<*>}
   */
  async getServiceCharacteristic( serviceUUID, characteristicUUID ) {
    const characteristic = await this.makeAttemptToGetCharacteristic( serviceUUID, characteristicUUID );
    if ( characteristic ) {
      return characteristic;
    }
    throw new Error( `No connected bluetooth server has the specified service: ${serviceUUID}` );
  },

  /**
   * Gets a notification abstraction for a bluetooth characteristic. Lets you add an event listener that
   * will be called when the value of the characteristic changes.
   * @param serviceUUID
   * @param characteristicUUID
   * @returns {Promise<*>}
   */
  async getServiceCharacteristicNotifier( serviceUUID, characteristicUUID ) {
    const characteristic = await this.getServiceCharacteristic( serviceUUID, characteristicUUID );
    return characteristic.startNotifications().catch( error => {
      phet.paperLand.console.error( 'Could not start notifications for characteristic', error );
    } );
  },

  /**
   * Add an event listener to a changing BLE characteristic.
   * @param serviceUUID - The UUID of the service that the characteristic belongs to.
   * @param characteristicUUID - The UUID of the characteristic that you want to listen to.
   * @param listener - Called with the value whenever the characteristic changes. Remember value is encoded,
   *                   (call getFloat32, getUint8, etc. on the DataView object to get the actual value).
   * @returns {Promise<()=>void>} - The callback added to the event, returned so it can be removed.
   */
  async addCharacteristicListener( serviceUUID, characteristicUUID, listener ) {

    const characteristicListener = event => {
      listener( event.target.value );
    };

    const characteristic = await this.getServiceCharacteristicNotifier( serviceUUID, characteristicUUID );
    characteristic.addEventListener( 'characteristicvaluechanged', characteristicListener );

    return characteristicListener;
  },

  async removeCharacteristicListener( serviceUUID, characteristicUUID, listener ) {
    const characteristic = await this.getServiceCharacteristic( serviceUUID, characteristicUUID );
    characteristic.removeEventListener( 'characteristicvaluechanged', listener );
  }
};

// Assign to the namespace so that the available servers can be accessed from the paper program code.
paperLand.boardBluetoothServers = boardBluetoothServers;

// This will be used from paper program code, but be sure to import in an entry file so that it is available.
export default boardBluetoothServers;